/* Transactional email invariants: no network calls, accounts or live messages. */
const fs = require("node:fs");
const assert = require("node:assert/strict");
const load = (p) => fs.readFileSync(p, "utf8");

const authActions = ["confirmation", "invite", "recovery", "magic_link", "email_change"];
const securityNotices = [
  "password_changed", "email_changed", "phone_changed",
  "identity_linked", "identity_unlinked", "mfa_factor_enrolled", "mfa_factor_unenrolled",
];
const config = load("supabase/config.toml");
const all = [...authActions, "reauthentication", ...securityNotices];

for (const name of all) {
  const html = load("supabase/templates/auth/" + name + ".html");
  assert(html.startsWith("<!doctype html>"), name + ": missing document");
  assert(html.includes('lang="en"'), name + ": missing language");
  assert(html.includes('name="viewport"'), name + ": not mobile-friendly");
  assert(html.includes("ZERTAINITY"), name + ": missing branding");
  assert(html.includes("support@zertainity.in"), name + ": missing contact");
  assert(html.includes('role="presentation"'), name + ": table layout inaccessible");
  assert(!/<script\b/i.test(html), name + ": no scripts in emails");
  const emailImages = [...html.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);
  assert.equal(emailImages.length, 1, name + ": exactly one permitted brand image");
  assert(emailImages[0].includes('src="https://www.zertainity.in/zertainity-email-logo.png"'),
    name + ": logo must use approved first-party URL, not trackers");
  assert(emailImages[0].includes('alt="Zertainity logo"'), name + ": logo needs fallback text");
  assert(emailImages[0].includes('width="80"') && emailImages[0].includes('height="80"'),
    name + ": dimensions must be fixed to prevent layout jumps");
  assert(!html.includes("test?token="), name + ": test tokens not permitted");
  assert(config.includes('content_path = "./supabase/templates/auth/' + name + '.html"'),
    name + ": missing local Auth configuration");
  if (authActions.includes(name)) {
    assert(html.includes("{{ .ConfirmationURL }}"), name + ": token-bearing confirmation link missing");
    assert(html.match(/\{\{ \.ConfirmationURL \}\}/g).length >= 2,
      name + ": secure fallback link missing");
    assert(html.includes('href="{{ .ConfirmationURL }}"'), name + ": CTA is not the actual Supabase URL");
  } else if (name === "reauthentication") {
    assert(html.includes("{{ .Token }}"), name + ": reauthentication must use OTP");
    assert(!html.includes("{{ .ConfirmationURL }}"), name + ": unexpected verification URL");
  } else {
    assert(!html.includes("{{ .ConfirmationURL }}"), name + ": security notices should not include reusable auth links");
    assert(!html.includes("{{ .Token }}"), name + ": security notices must not leak OTPs");
  }
}

const invite = load("supabase/functions/invite-user/index.ts");
const resend = load("supabase/functions/resend-invite/index.ts");
const notifications = load("supabase/functions/send-notification/index.ts");
const role = load("supabase/functions/update-user-role/index.ts");
const deleted = load("supabase/functions/delete-user/index.ts");
const shared = load("supabase/functions/_shared/email-templates.ts");
const tester = load("supabase/functions/test-email-sender/index.ts");
assert(!tester.includes("const to = '") && !tester.includes("for (const t of testTemplates)"),
  "Never bulk-send tests or hardcode a real mailbox");
assert(tester.includes("sentCount: 1") && tester.includes("request.template"),
  "Admin test sender must explicitly select only one preview");
assert(tester.includes(".replaceAll('{{ .ConfirmationURL }}'"),
  "Mock Auth previews must replace all token-bearing links");

assert(invite.includes("inviteUserByEmail"), "Invitation must be sent by Supabase Auth");
assert(resend.includes("inviteUserByEmail"), "Resent invite must be sent by Supabase Auth");
assert(!invite.includes("functions/v1/send-notification"), "Do not send second invitation without an activation link");
assert(!resend.includes("functions/v1/send-notification"), "Do not send duplicated resend notice");
assert(!notifications.includes("html || buildHtmlFromType"), "Custom caller-supplied HTML bypasses branded templates");
assert(notifications.includes("emailResponse.error"), "Do not claim success when mail provider failed");
assert(role.includes("type: 'role_change'") && !role.includes("<h1>Role Update Notification</h1>"),
  "Role updates must use the branded template");
assert(deleted.includes("type: 'deletion'") && !deleted.includes("<h1>Account Deletion Notice</h1>"),
  "Account removals must use the branded template");
assert(shared.includes("escapeEmailHtml"), "Untrusted notification fields must be HTML escaped");
assert(shared.includes("https://www.zertainity.in/zertainity-email-logo.png"),
  "Notification email must use the same branded asset");
assert(shared.includes("alt='Zertainity logo'"), "Notification branding needs fallback text");
assert(fs.existsSync("public/zertainity-email-logo.png") && fs.existsSync("public/zertainity-email-logo.svg"),
  "Email logo files must be published");
const image = fs.readFileSync("public/zertainity-email-logo.png");
assert(image.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])),
  "Logo must be a real PNG image, not a renamed SVG");
assert(!shared.includes("24 hours"), "Template must not assert an unverified expiry time");

console.log("PASS: 13 Auth templates, links, accessibility, provider checks and single-invitation flow");
