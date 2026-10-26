// Source-level checks for local Supabase Go email templates and Resend Edge templates.
// Do not invoke live providers or generate usable invitation/recovery tokens in CI.
const fs = require("node:fs");
const assert = require("node:assert/strict");
const file = (path) => fs.readFileSync(path, "utf8");

const auth = {
  invite: "ConfirmationURL",
  confirmation: "ConfirmationURL",
  recovery: "ConfirmationURL",
  magic_link: "ConfirmationURL",
  email_change: "ConfirmationURL",
  reauthentication: "Token",
};
const notification = [
  "password_changed", "email_changed", "phone_changed",
  "identity_linked", "identity_unlinked", "mfa_factor_enrolled", "mfa_factor_unenrolled",
];
const config = file("supabase/config.toml");
for (const [name, token] of Object.entries(auth)) {
  const html = file("supabase/templates/" + name + ".html");
  assert(html.includes("{{ ." + token + " }}"), name + " loses its required Supabase token");
  assert(html.includes("<meta name=\"viewport\"") && html.includes("Zertainity"),
    name + " must remain responsive and branded");
  assert(!/<script\b|<iframe\b|http:\/\/|https:\/\/fonts\./i.test(html),
    name + " must not use executable or remotely loaded resources");
  assert(config.includes("[auth.email.template." + name + "]"),
    name + " must be configured for local Auth");
  assert(config.includes('content_path = "./supabase/templates/' + name + '.html"'),
    name + " configured path mismatch");
}
for (const name of notification) {
  const html = file("supabase/templates/" + name + ".html");
  assert(html.includes("Zertainity") && html.includes("mailto:support@zertainity.in"),
    name + " needs branding and support contact");
  assert(!html.includes("{{ .ConfirmationURL }}"),
    name + " must not accidentally include an activation link");
  assert(config.includes("[auth.email.notification." + name + "]"),
    name + " security notification must have a local config block");
}
const edgeTemplate = file("supabase/functions/_shared/email-templates.ts");
for (const name of [
  "buildInviteEmail", "buildRoleChangeEmail", "buildDeletionEmail",
  "buildSuspensionEmail", "buildWelcomeEmail", "buildGenericEmail",
  "getVerificationTemplate", "getPasswordResetTemplate", "getMagicLinkTemplate",
]) assert(edgeTemplate.includes("export function " + name), "Email API changed: " + name);
assert(edgeTemplate.includes("escapeHtml(") && edgeTemplate.includes("secureUrl("),
  "Resend templates must sanitize dynamic data and links");

const ts = require("typescript");
const vm = require("node:vm");
const compiled = ts.transpileModule(edgeTemplate, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  reportDiagnostics: true,
  fileName: "email-templates.ts",
});
assert(!(compiled.diagnostics || []).some(d => d.category === ts.DiagnosticCategory.Error),
  "Edge email templates must transpile without syntax errors");
const runtime = { exports: {}, URL, Date };
vm.runInNewContext(compiled.outputText, runtime, { timeout: 1000 });
assert(runtime.exports.getVerificationTemplate().includes("{{ .ConfirmationURL }}"),
  "Preview verification template must keep the original one-time link");
assert(runtime.exports.getPasswordResetTemplate().includes("{{ .ConfirmationURL }}"),
  "Preview recovery template must keep the original one-time link");
const dangerous = "<img src=x onerror=alert(1)>";
const roleEmailHtml = runtime.exports.buildRoleChangeEmail(dangerous, dangerous);
assert(!roleEmailHtml.includes(dangerous) && roleEmailHtml.includes("&lt;img"),
  "Untrusted role fields must be HTML escaped");
const generic = runtime.exports.buildGenericEmail(dangerous, dangerous, "Open", "javascript:alert(1)");
assert(!generic.includes(dangerous) && !generic.includes("href=\"javascript:"),
  "Generic notification fields and CTA URLs must be escaped or blocked");

const invite = file("supabase/functions/invite-user/index.ts");
const resend = file("supabase/functions/resend-invite/index.ts");
assert(!invite.includes("type: 'invite'") && !resend.includes("type: 'invite'"),
  "Invites must be sent ONLY by Supabase Auth with the real token URL");
const notify = file("supabase/functions/send-notification/index.ts");
assert(!notify.includes("const emailHtml = html ||") && notify.includes("emailResponse.error"),
  "Never accept arbitrary caller HTML or claim provider errors are success");
const tests = file("supabase/functions/test-email-sender/index.ts");
assert(!tests.includes("for (const t of testTemplates)") && tests.includes("sentCount: 1"),
  "Do not bulk send template tests");
console.log("PASS: Six Auth templates + seven security notifications + Resend email safety checks");
