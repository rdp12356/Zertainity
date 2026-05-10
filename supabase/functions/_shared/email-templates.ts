// ─── Professional Email Templates for Zertainity ───────────────────────────
// Shared module used by all Edge Functions that send emails via Resend.
// Import with: import { buildInviteEmail, ... } from '../_shared/email-templates.ts';
// ────────────────────────────────────────────────────────────────────────────

const BRAND = {
  name: "Zertainity",
  tagline: "Your Career, Your Certainty.",
  url: "https://zertainity.in",
  supportEmail: "support@zertainity.in",
  primaryColor: "#111827",   // gray-900
  accentColor: "#2563EB",    // blue-600
  lightBg: "#F9FAFB",        // gray-50
  borderColor: "#E5E7EB",    // gray-200
  mutedText: "#6B7280",      // gray-500
  year: new Date().getFullYear(),
};

// ─── Master Shell ──────────────────────────────────────────────────────────
// Wraps any email body content in a professional, responsive HTML email layout.
function buildEmailShell(bodyContent: string, preheader = ""): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${BRAND.name}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${BRAND.lightBg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:${BRAND.lightBg};">${preheader}</div>` : ""}

  <!-- Outer Container -->
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:${BRAND.lightBg};">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Email Card -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background-color:#FFFFFF;border-radius:12px;border:1px solid ${BRAND.borderColor};overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND.primaryColor};padding:28px 32px;text-align:center;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#FFFFFF;letter-spacing:-0.02em;">${BRAND.name}</h1>
              <p style="margin:6px 0 0;font-size:12px;font-weight:400;color:rgba(255,255,255,0.6);letter-spacing:0.04em;text-transform:uppercase;">${BRAND.tagline}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 24px;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <hr style="border:none;border-top:1px solid ${BRAND.borderColor};margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px 28px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:${BRAND.mutedText};line-height:1.5;">
                Need help? Contact us at
                <a href="mailto:${BRAND.supportEmail}" style="color:${BRAND.accentColor};text-decoration:none;">${BRAND.supportEmail}</a>
              </p>
              <p style="margin:0;font-size:11px;color:#9CA3AF;line-height:1.5;">
                &copy; ${BRAND.year} ${BRAND.name} &middot;
                <a href="${BRAND.url}/privacy-policy" style="color:#9CA3AF;text-decoration:underline;">Privacy</a> &middot;
                <a href="${BRAND.url}/terms-of-service" style="color:#9CA3AF;text-decoration:underline;">Terms</a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Button Helper ─────────────────────────────────────────────────────────
function buildButton(text: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:24px 0;">
  <tr>
    <td align="center">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:44px;v-text-anchor:middle;width:220px;" arcsize="14%" stroke="f" fillcolor="${BRAND.primaryColor}">
        <w:anchorlock/>
        <center style="color:#ffffff;font-family:sans-serif;font-size:14px;font-weight:600;">${text}</center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-->
      <a href="${href}" target="_blank" style="display:inline-block;background-color:${BRAND.primaryColor};color:#FFFFFF;font-size:14px;font-weight:600;text-decoration:none;padding:12px 32px;border-radius:8px;line-height:1;letter-spacing:-0.01em;">${text}</a>
      <!--<![endif]-->
    </td>
  </tr>
</table>`;
}

// ─── Paragraph Helper ──────────────────────────────────────────────────────
function p(text: string, extra = ""): string {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;${extra}">${text}</p>`;
}

// ─── Email Templates ───────────────────────────────────────────────────────

/** Invitation email — sent when an admin invites a new user. */
export function buildInviteEmail(role: string): string {
  const body = `
    ${p("You've been invited to join <strong>Zertainity</strong> — an intelligent career guidance platform for students.")}
    ${p(`Your assigned role: <strong style="color:${BRAND.primaryColor};text-transform:capitalize;">${role}</strong>`)}
    ${p("Please check your inbox for a separate verification email to activate your account. Once verified, you'll have full access to the platform.")}
    ${buildButton("Visit Zertainity", BRAND.url)}
    ${p("If you didn't expect this invitation, you can safely ignore this email.", `font-size:13px;color:${BRAND.mutedText};`)}
  `;
  return buildEmailShell(body, `You've been invited to join Zertainity as ${role}.`);
}

/** Role change notification — sent when a user's role is updated. */
export function buildRoleChangeEmail(newRole: string, changedBy = "an administrator"): string {
  const body = `
    ${p(`Your role on <strong>Zertainity</strong> has been updated by ${changedBy}.`)}
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 20px;">
      <tr>
        <td style="background-color:${BRAND.lightBg};border-radius:8px;padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:12px;color:${BRAND.mutedText};text-transform:uppercase;letter-spacing:0.05em;">New Role</p>
          <p style="margin:0;font-size:18px;font-weight:600;color:${BRAND.primaryColor};text-transform:capitalize;">${newRole}</p>
        </td>
      </tr>
    </table>
    ${p("Your permissions have been adjusted accordingly. Log in to see the changes.")}
    ${buildButton("Open Zertainity", BRAND.url)}
  `;
  return buildEmailShell(body, `Your role has been updated to ${newRole}.`);
}

/** Account deletion notice — sent when an admin deletes a user account. */
export function buildDeletionEmail(): string {
  const body = `
    ${p("We're writing to confirm that your <strong>Zertainity</strong> account has been removed by an administrator.")}
    ${p("All your personal data, assessment results, and profile information have been permanently deleted from our systems.")}
    ${p("If you believe this was done in error, please contact our support team immediately.")}
    ${buildButton("Contact Support", `mailto:${BRAND.supportEmail}`)}
  `;
  return buildEmailShell(body, "Your Zertainity account has been removed.");
}

/** Suspension notice — sent when a user is suspended. */
export function buildSuspensionEmail(reason?: string): string {
  const body = `
    ${p("Your <strong>Zertainity</strong> account has been temporarily suspended by an administrator.")}
    ${reason ? `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 20px;">
      <tr>
        <td style="background-color:#FEF2F2;border-left:3px solid #EF4444;border-radius:4px;padding:14px 18px;">
          <p style="margin:0 0 4px;font-size:12px;color:#991B1B;text-transform:uppercase;letter-spacing:0.05em;">Reason</p>
          <p style="margin:0;font-size:14px;color:#7F1D1D;line-height:1.5;">${reason}</p>
        </td>
      </tr>
    </table>` : ""}
    ${p("While suspended, you will not be able to access your account or any platform features.")}
    ${p("If you believe this was a mistake, please reach out to our support team.")}
    ${buildButton("Contact Support", `mailto:${BRAND.supportEmail}`)}
  `;
  return buildEmailShell(body, "Your Zertainity account has been suspended.");
}

/** Welcome email — sent after a user first signs up. */
export function buildWelcomeEmail(): string {
  const body = `
    ${p("Welcome to <strong>Zertainity</strong>! 🎓")}
    ${p("You're now part of a platform that helps students discover their ideal career paths through AI-powered assessments and detailed roadmaps.")}
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 24px;">
      <tr>
        <td style="background-color:${BRAND.lightBg};border-radius:8px;padding:20px;">
          <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:${BRAND.primaryColor};">Here's how to get started:</p>
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr><td style="padding:4px 0;font-size:14px;color:#374151;">1. Take the career assessment quiz</td></tr>
            <tr><td style="padding:4px 0;font-size:14px;color:#374151;">2. Get personalized career recommendations</td></tr>
            <tr><td style="padding:4px 0;font-size:14px;color:#374151;">3. Explore detailed career pathways and roadmaps</td></tr>
            <tr><td style="padding:4px 0;font-size:14px;color:#374151;">4. Browse 150+ careers and entrance exams</td></tr>
          </table>
        </td>
      </tr>
    </table>
    ${buildButton("Start Your Journey", `${BRAND.url}/education-level`)}
  `;
  return buildEmailShell(body, "Welcome to Zertainity! Start your career journey today.");
}

/** Generic notification — for custom messages that still need the branded wrapper. */
export function buildGenericEmail(title: string, message: string, ctaText?: string, ctaUrl?: string): string {
  const body = `
    <h2 style="margin:0 0 16px;font-size:20px;font-weight:600;color:${BRAND.primaryColor};letter-spacing:-0.01em;">${title}</h2>
    ${p(message)}
    ${ctaText && ctaUrl ? buildButton(ctaText, ctaUrl) : ""}
  `;
  return buildEmailShell(body);
}

// ─── Supabase Auth Templates (for Dashboard paste) ─────────────────────────
// These are exported for reference / documentation only.

/** Verification email HTML — paste into Supabase Auth → Email Templates → Confirm signup */
export function getVerificationTemplate(): string {
  const body = `
    ${p("Thanks for signing up for <strong>Zertainity</strong>! Please verify your email address to activate your account.")}
    ${p("Click the button below to confirm your email and start exploring personalized career guidance.")}
    ${buildButton("Verify Email Address", "{{ .ConfirmationURL }}")}
    ${p("If you didn't create an account on Zertainity, you can safely ignore this email.", `font-size:13px;color:${BRAND.mutedText};`)}
  `;
  return buildEmailShell(body, "Verify your email to get started on Zertainity.");
}

/** Password reset email HTML — paste into Supabase Auth → Email Templates → Reset password */
export function getPasswordResetTemplate(): string {
  const body = `
    ${p("We received a request to reset the password for your <strong>Zertainity</strong> account.")}
    ${p("Click the button below to set a new password. This link will expire in 24 hours.")}
    ${buildButton("Reset Password", "{{ .ConfirmationURL }}")}
    ${p("If you didn't request a password reset, your account is safe — no action is needed.", `font-size:13px;color:${BRAND.mutedText};`)}
  `;
  return buildEmailShell(body, "Reset your Zertainity password.");
}

/** Magic link email HTML — paste into Supabase Auth → Email Templates → Magic link */
export function getMagicLinkTemplate(): string {
  const body = `
    ${p("Click the button below to log in to your <strong>Zertainity</strong> account.")}
    ${buildButton("Log In to Zertainity", "{{ .ConfirmationURL }}")}
    ${p("This link will expire in 24 hours. If you didn't request this, you can safely ignore this email.", `font-size:13px;color:${BRAND.mutedText};`)}
  `;
  return buildEmailShell(body, "Your Zertainity login link.");
}
