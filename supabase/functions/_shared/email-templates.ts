/**
 * Zertainity transactional emails — HTML compatible with Gmail, Outlook and mobile.
 * No remote fonts, trackers or external images. Keep login URLs supplied by Supabase.
 * Hosted Auth emails are configured separately using supabase/templates/auth/*.html.
 */
const BRAND = {
  name: "Zertainity",
  tagline: "Find your direction. Build your future.",
  origin: "https://www.zertainity.in",
  support: "support@zertainity.in",
  navy: "#101b35",
  indigo: "#5145d8",
  muted: "#52627a",
  border: "#e5e9f1",
  canvas: "#f5f7fb",
};

export function escapeEmailHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[ch] || ch));
}

const paragraph = (text: string) =>
  "<p style='margin:0 0 18px;font-size:15px;line-height:1.75;color:#37465e'>" + text + "</p>";

const notice = (text: string) =>
  "<table role='presentation' width='100%' cellspacing='0' cellpadding='0' style='margin-top:20px;border:1px solid #dee4f2;background:#f5f7ff;border-radius:12px'><tr><td style='padding:16px 18px;font-size:13px;line-height:1.65;color:#455575'>" + text + "</td></tr></table>";

function safeActionUrl(url: string): string {
  // Templated Supabase URLs are emitted unchanged; runtime links must be HTTPS
  // and authentication links must never be placed in account-change notifications.
  if (url === "{{ .ConfirmationURL }}") return url;
  if (url === "mailto:" + BRAND.support) return url;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" && parsed.username === "" && parsed.password === "") return escapeEmailHtml(url);
  } catch { /* Render no button for invalid URL. */ }
  return "";
}

function button(label: string, url: string): string {
  const href = safeActionUrl(url);
  if (!href) return "";
  return "<table role='presentation' cellpadding='0' cellspacing='0' width='100%' style='margin:28px 0 20px'><tr><td align='left'>" +
    "<a href='" + href + "' style='display:inline-block;background:#5145d8;border-radius:10px;color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:700;line-height:20px;padding:15px 24px;text-decoration:none'>" + escapeEmailHtml(label) + "</a>" +
    "</td></tr></table>";
}

function shell(category: string, heading: string, preheader: string, body: string): string {
  return [
    "<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>",
    "<meta name='color-scheme' content='light'><title>", escapeEmailHtml(heading), " | Zertainity</title></head>",
    "<body style='margin:0;padding:0;background:", BRAND.canvas, ";font-family:Arial,Helvetica,sans-serif'>",
    "<div style='display:none;font-size:1px;line-height:1px;color:", BRAND.canvas, ";max-height:0;max-width:0;opacity:0;overflow:hidden'>",
    escapeEmailHtml(preheader), "</div>",
    "<table role='presentation' cellpadding='0' cellspacing='0' width='100%' style='background:", BRAND.canvas, "'><tr><td align='center' style='padding:34px 14px 48px'>",
    "<table role='presentation' cellpadding='0' cellspacing='0' width='100%' style='max-width:560px;background:#ffffff;border:1px solid ", BRAND.border, ";border-radius:16px'>",
    "<tr><td style='height:5px;background:", BRAND.indigo, ";font-size:0;line-height:0'>&nbsp;</td></tr>",
    "<tr><td style='padding:32px 34px 14px'>",
    "<div style='font-size:21px;line-height:28px;letter-spacing:-.7px;font-weight:800;color:", BRAND.navy, "'>Z<span style='color:", BRAND.indigo, "'>·</span> ZERTAINITY</div>",
    "<p style='margin:6px 0 0;font-size:11px;line-height:17px;letter-spacing:1.2px;color:", BRAND.muted, ";text-transform:uppercase'>", escapeEmailHtml(BRAND.tagline), "</p>",
    "</td></tr><tr><td style='padding:16px 34px 34px'>",
    "<p style='margin:0 0 12px;color:", BRAND.indigo, ";font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase'>", escapeEmailHtml(category), "</p>",
    "<h1 style='margin:0 0 18px;color:", BRAND.navy, ";font-size:29px;line-height:1.2;letter-spacing:-.7px;font-weight:750'>", escapeEmailHtml(heading), "</h1>",
    body,
    "</td></tr><tr><td style='border-top:1px solid ", BRAND.border, ";padding:23px 34px 28px'>",
    "<p style='margin:0 0 8px;font-size:12px;line-height:1.7;color:", BRAND.muted, "'>Questions? Write to <a href='mailto:", BRAND.support, "' style='color:", BRAND.indigo, ";text-decoration:underline'>", BRAND.support, "</a>.</p>",
    "<p style='margin:0;font-size:11px;line-height:1.6;color:#8190a4'>Zertainity · Career guidance for Indian students<br>",
    "<a href='", BRAND.origin, "/privacy-policy' style='color:#8190a4'>Privacy</a> &nbsp;·&nbsp; ",
    "<a href='", BRAND.origin, "/terms-of-service' style='color:#8190a4'>Terms</a><br>",
    "© ", new Date().getFullYear(), " Zertainity. This is an account-related email.</p>",
    "</td></tr></table></td></tr></table></body></html>",
  ].join("");
}

const smallPrint = (text: string) =>
  paragraph("<span style='font-size:13px;color:#66758c'>" + text + "</span>");

const actionFallback = (url: string) => {
  // Go-template placeholder is substituted by Supabase Auth at delivery time.
  return "<p style='font-size:12px;line-height:1.65;color:#66758c;overflow-wrap:anywhere'>Button not working? Paste this secure link into your browser:<br><a href='" +
    url + "' style='color:#5145d8;word-break:break-all'>" + url + "</a></p>";
};

export function buildInviteEmail(role: string, acceptanceLink?: string): string {
  const assignedRole = escapeEmailHtml(role);
  return shell("YOU'RE INVITED", "Your next chapter starts here",
    "An invitation to join Zertainity.", paragraph("An administrator has invited you to join Zertainity.") +
    notice("Your invited role: <strong>" + assignedRole + "</strong>") +
    (acceptanceLink ? button("Accept your invitation", acceptanceLink) : paragraph("Use the secure invitation link from your Zertainity authentication email to activate your account.")) +
    smallPrint("Didn't expect this invitation? You don't need to take any action."));
}

export function buildRoleChangeEmail(newRole: string, changedBy = "an administrator"): string {
  return shell("ACCOUNT UPDATE", "Your access has changed", "A role update on your account.",
    paragraph("Your role on Zertainity has been updated.") +
    notice("Current role: <strong>" + escapeEmailHtml(newRole) + "</strong><br>Changed by: " + escapeEmailHtml(changedBy)) +
    button("Review your account", BRAND.origin + "/settings") +
    smallPrint("If you don't recognize this change, contact support."));
}

export function buildDeletionEmail(): string {
  return shell("ACCOUNT NOTICE", "Your account was removed", "An update about your Zertainity account.",
    paragraph("An administrator has removed access to your Zertainity account.") +
    paragraph("Some records may be retained temporarily where required by applicable policies or law.") +
    button("Contact support", "mailto:" + BRAND.support) +
    smallPrint("If you believe this was a mistake, please reach out to us."));
}

export function buildSuspensionEmail(reason?: string): string {
  return shell("ACCOUNT SECURITY", "Your account is suspended", "An important notice about your account.",
    paragraph("Your Zertainity account has been temporarily suspended. You may not be able to sign in while this restriction is active.") +
    (reason ? notice("Reason provided: " + escapeEmailHtml(reason)) : "") +
    button("Contact support", "mailto:" + BRAND.support) +
    smallPrint("If you believe this is an error, our team can review it."));
}

export function buildWelcomeEmail(): string {
  return shell("WELCOME", "A clearer path begins today", "Welcome to Zertainity.",
    paragraph("Welcome to Zertainity. Explore careers, build your understanding of study pathways, and make more informed choices at your own pace.") +
    notice("Start with a career assessment, explore career profiles, or browse entrance examinations.") +
    button("Explore your dashboard", BRAND.origin + "/dashboard") +
    smallPrint("Recommendations are guidance, not guarantees of admission or career outcomes."));
}

export function buildGenericEmail(title: string, message: string, ctaText?: string, ctaUrl?: string): string {
  return shell("ZERTAINITY UPDATE", title, title,
    paragraph(escapeEmailHtml(message).replace(/\n/g, "<br>")) +
    (ctaText && ctaUrl ? button(ctaText, ctaUrl) : "") +
    smallPrint("This message relates to your Zertainity account or a service request."));
}

// These HTML templates are references. For hosted Supabase, install the
// matching HTML files under supabase/templates/auth through Auth → Email Templates.
function authEmail(type: string, heading: string, description: string, actionLabel: string): string {
  return shell(type, heading, description,
    paragraph(escapeEmailHtml(description)) +
    button(actionLabel, "{{ .ConfirmationURL }}") +
    actionFallback("{{ .ConfirmationURL }}") +
    smallPrint("If you didn't request this action, you can ignore this email. Never share the link."));
}
export function getInviteAuthTemplate(): string {
  return authEmail("INVITATION", "You're invited to Zertainity", "A Zertainity administrator has invited you to join. Accept your invitation to set up your account.", "Accept invitation");
}
export function getVerificationTemplate(): string {
  return authEmail("VERIFY EMAIL", "Make it official", "Confirm your email address to finish setting up your Zertainity account.", "Verify email address");
}
export function getPasswordResetTemplate(): string {
  return authEmail("PASSWORD RESET", "Reset your password", "Someone requested a password reset for your Zertainity account. Use the secure link to choose a new one.", "Reset password");
}
export function getMagicLinkTemplate(): string {
  return authEmail("SIGN IN", "Your one-time sign-in link", "Use this secure link to sign in to Zertainity. Links can expire or be used only once.", "Sign in securely");
}
export function getEmailChangeTemplate(): string {
  return authEmail("EMAIL CHANGE", "Confirm your email change", "Please verify the new email address requested for your Zertainity account.", "Confirm email change");
}
export function getReauthenticationTemplate(): string {
  return shell("SECURITY CODE", "Confirm it's you", "Your Zertainity verification code.",
    paragraph("Use the code below to confirm a sensitive account change.") +
    notice("<span style='font-family:monospace;font-size:26px;letter-spacing:5px;font-weight:bold;color:#101b35'>{{ .Token }}</span>") +
    smallPrint("This code expires soon. Never share it, even with someone claiming to work for Zertainity."));
}
