// Zertainity transactional email design system. Inline styles and tables work in Gmail/Outlook.
// This module is used by the privileged Resend Edge Function and template test sender.
// Managed Supabase Auth templates are source-controlled separately in supabase/templates/.
const BRAND = {
  name: "Zertainity",
  url: "https://www.zertainity.in",
  help: "support@zertainity.in",
  ink: "#111A37", muted: "#5E6B83", purple: "#593CFB", surface: "#F3F5FB",
  border: "#DFE4F0",
};

const escapeHtml = (input: unknown): string => String(input ?? "").replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] || c));

const secureUrl = (value: string): string => {
  // Auth template placeholders are trusted literals, resolved by Supabase.
  if (value === "{{ .ConfirmationURL }}") return value;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "mailto:") return escapeHtml(url.toString());
  } catch { /* invalid link */ }
  return "";
};

const paragraph = (value: string) => `<p style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:${BRAND.ink};">${value}</p>`;

const button = (title: string, href: string) => {
  const safeHref = secureUrl(href);
  if (!safeHref) return "";
  return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:28px 0 18px"><tr><td bgcolor="${BRAND.purple}" style="border-radius:10px;text-align:center;"><a href="${safeHref}" target="_blank" style="background-color:${BRAND.purple};border:1px solid ${BRAND.purple};border-radius:10px;color:#ffffff;display:inline-block;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;line-height:22px;padding:14px 24px;text-decoration:none;">${escapeHtml(title)}</a></td></tr></table>`;
};

const softPanel = (heading: string, value: string) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0 24px"><tr><td style="background:#F4F2FF;border:1px solid #E6E0FF;border-radius:12px;padding:18px 20px"><p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;color:#6557A8;margin:0 0 6px">${escapeHtml(heading)}</p><p style="font-family:Arial,sans-serif;font-size:19px;line-height:1.4;font-weight:700;color:${BRAND.ink};margin:0">${escapeHtml(value)}</p></td></tr></table>`;

function shell(title: string, lead: string, body: string, preheader: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(title)} · Zertainity</title></head>
<body style="margin:0;padding:0;background:${BRAND.surface};font-family:Arial,Helvetica,sans-serif;color:${BRAND.ink}">
<div style="display:none!important;max-height:0;overflow:hidden;mso-hide:all;opacity:0;color:transparent">${escapeHtml(preheader)}&#8203;&nbsp;&#8203;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.surface}"><tr><td align="center" style="padding:38px 16px 48px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;border-collapse:separate;background:#ffffff;border:1px solid ${BRAND.border};border-radius:16px;overflow:hidden">
<tr><td style="height:5px;font-size:0;background:${BRAND.purple}" aria-hidden="true">&nbsp;</td></tr>
<tr><td style="padding:30px 38px 14px"><a href="${BRAND.url}" style="color:${BRAND.ink};font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:800;letter-spacing:-.6px;text-decoration:none">Zertainity<span style="color:${BRAND.purple}">.</span></a><div style="margin-top:5px;font-size:12px;color:${BRAND.muted}">Career clarity, one step at a time.</div></td></tr>
<tr><td style="padding:12px 38px 26px">
<p style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;font-weight:700;color:${BRAND.purple};margin:0 0 12px">Zertainity · Account update</p>
<h1 style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:29px;line-height:1.2;letter-spacing:-.65px;font-weight:800;color:${BRAND.ink}">${escapeHtml(title)}</h1>
<p style="margin:0 0 26px;font-size:16px;line-height:1.6;color:${BRAND.muted}">${escapeHtml(lead)}</p>
${body}
</td></tr>
<tr><td style="padding:23px 38px 30px;border-top:1px solid ${BRAND.border};background:#FAFBFF">
<p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:${BRAND.muted}">Questions? <a href="mailto:${BRAND.help}" style="color:${BRAND.purple};font-weight:700;text-decoration:none">Contact support</a></p>
<p style="margin:0 0 12px;font-size:12px;line-height:1.6;color:${BRAND.muted}">If you didn't request this action, you can ignore this email or contact us if you're concerned about your account.</p>
<p style="margin:0;font-size:11px;color:#8B94A7">&copy; ${new Date().getFullYear()} Zertainity · <a href="${BRAND.url}/privacy-policy" style="color:#8B94A7">Privacy</a> · <a href="${BRAND.url}/terms-of-service" style="color:#8B94A7">Terms</a></p>
</td></tr></table>
<p style="margin:18px 12px;font-size:11px;line-height:1.5;color:#8892A5;text-align:center">A service email from Zertainity. No marketing subscription is required.</p>
</td></tr></table></body></html>`;
}

const actionBody = (copy: string, label: string, url: string) =>
  paragraph(copy) + button(label, url) + paragraph(`<span style="font-size:12px;color:${BRAND.muted}">Only use links from emails you expected. Never share your verification or reset link.</span>`);

export function buildInviteEmail(role: string): string {
  return shell("You're invited", "A place for clearer academic and career decisions.",
    paragraph("An administrator invited you to Zertainity.") +
    softPanel("Invitation role", role) +
    paragraph("Your activation link is sent separately by our secure identity provider. Use that verification message to accept the invitation.") +
    button("Explore Zertainity", BRAND.url),
    "Your Zertainity invitation details");
}
export function buildRoleChangeEmail(newRole: string, changedBy = "a Zertainity administrator"): string {
  return shell("Your access has changed", "Your account permissions were updated.",
    paragraph(`Your role has been updated by ${escapeHtml(changedBy)}.`) +
    softPanel("Updated role", newRole) + button("Review your account", BRAND.url + "/dashboard"),
    "Your Zertainity role permissions have changed");
}
export function buildDeletionEmail(): string {
  return shell("Account removal notice", "Your Zertainity account was removed by an administrator.",
    paragraph("You may no longer be able to sign in. Data retention or deletion follows our privacy policy; we cannot guarantee every system or backup is deleted immediately.") +
    button("Contact support", "mailto:" + BRAND.help),
    "A notice about your Zertainity account");
}
export function buildSuspensionEmail(reason?: string): string {
  return shell("Account access paused", "Your Zertainity account has been temporarily suspended.",
    (reason ? softPanel("Reason", reason) : "") +
    paragraph("If you believe this is a mistake, please contact support. Do not share your password or verification codes.") +
    button("Contact support", "mailto:" + BRAND.help),
    "A security update about account access");
}
export function buildWelcomeEmail(): string {
  return shell("Welcome to Zertainity", "Explore opportunities with confidence and curiosity.",
    paragraph("You're ready to explore career paths, compare subjects and entrance exams, and save options for later.") +
    paragraph("Start with the assessment, then follow your personalized results at your own pace.") +
    button("Explore career pathways", BRAND.url + "/education-level"),
    "Welcome! Your career discovery journey starts here");
}
export function buildGenericEmail(title: string, message: string, ctaText?: string, ctaUrl?: string): string {
  return shell(title, "A notification from your Zertainity account.",
    paragraph(escapeHtml(message)) + (ctaText && ctaUrl ? button(ctaText, ctaUrl) : ""),
    title);
}

// Supabase-hosted Auth emails use dedicated static Go templates in supabase/templates/.
// These helpers remain for the admin-only preview/test function and share the same design.
export function getVerificationTemplate(): string {
  return shell("Verify your email", "Just one step before your Zertainity account is ready.",
    actionBody("Confirm that this address belongs to you to finish creating your account.", "Verify email address", "{{ .ConfirmationURL }}"),
    "Confirm your Zertainity email address");
}
export function getPasswordResetTemplate(): string {
  return shell("Reset your password", "A password reset was requested for your account.",
    actionBody("Use the secure button below to set a new password. This link is time-sensitive.", "Reset password", "{{ .ConfirmationURL }}"),
    "A secure link to reset your password");
}
export function getMagicLinkTemplate(): string {
  return shell("Your sign-in link", "Sign in without entering your password.",
    actionBody("This one-time link grants access to your account. Keep it private.", "Sign in securely", "{{ .ConfirmationURL }}"),
    "Your one-time Zertainity sign-in link");
}
