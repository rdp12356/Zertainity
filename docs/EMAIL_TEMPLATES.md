# Zertainity — transactional email system

All transactional messages use a coordinated white/navy/indigo responsive email design, no tracking images, no remote fonts, and clear support and account-security instructions. Keep this document with the code during handoff.

## Critical distinction: Supabase Auth versus Resend

**Supabase Auth sends the actual security tokens and links.** Email verification, invitations, password recovery, magic links, email changes, and reauthentication are NOT sent using the `send-notification` Edge Function. Their HTML lives in `supabase/templates/` as Supabase Go templates and uses the unmodified `{{ .ConfirmationURL }}` or `{{ .Token }}` placeholder.

**Resend** sends additional administrative notices (role changes, suspension, deletion, welcome, and generic status). Source: `supabase/functions/_shared/email-templates.ts`. The privileged `send-notification` function accepts an approved template type, not arbitrary HTML.

Invitation and resend invitation functions now send one official Supabase Auth invitation only, never a second email without an activation link.

## Hosted Supabase production — required manual activation

**The local** `supabase/config.toml` `[auth.email.*]` sections only configure local CLI development. Committing these files, running database migrations, or deploying Edge Functions does **not** change templates in an already hosted Supabase project's Auth service.

Go to [Supabase Authentication Email Templates](https://supabase.com/dashboard/project/lsnhzyknfuufscnpixve/auth/templates) with an authorized project administrator. For each entry below, open the corresponding template, copy the complete source-controlled HTML, set its subject, and save. Do not substitute a static `/auth` URL for the one-time `{{ .ConfirmationURL }}` or `{{ .Token }}` placeholder.

| Auth dashboard template | Source file | Subject |
| --- | --- | --- |
| Confirm signup | `supabase/templates/confirmation.html` | Verify your email · Zertainity |
| Invite user | `supabase/templates/invite.html` | You're invited to Zertainity |
| Magic link / OTP | `supabase/templates/magic_link.html` | Your secure Zertainity sign-in link |
| Change email address | `supabase/templates/email_change.html` | Confirm your new Zertainity email |
| Reset password | `supabase/templates/recovery.html` | Reset your Zertainity password |
| Reauthentication | `supabase/templates/reauthentication.html` | Your Zertainity verification code |

Security notification templates below are **optional features** that only send if that notification type has been enabled in your hosted project. Review the project's notification feature availability before enabling.

| Supabase security notification | HTML source |
| --- | --- |
| Password changed | `supabase/templates/password_changed.html` |
| Email address changed | `supabase/templates/email_changed.html` |
| Phone number changed | `supabase/templates/phone_changed.html` |
| Sign-in method linked | `supabase/templates/identity_linked.html` |
| Sign-in method removed | `supabase/templates/identity_unlinked.html` |
| Verification method added | `supabase/templates/mfa_factor_enrolled.html` |
| Verification method removed | `supabase/templates/mfa_factor_unenrolled.html` |

In the hosted dashboard, review **Authentication → URL Configuration** and confirm that `https://www.zertainity.in`, `https://zertainity.in`, `/auth`, and `/reset-password` redirect URLs are allowlisted as appropriate. Ensure auth and SMTP are correctly configured, the sender domain is verified, and click/open tracking on authentication links is disabled. Never place a real activation or password reset token in a GitHub issue, CI log, screenshot, or test fixture.

## Local Supabase template testing

1. Use the `supabase/config.toml` sections and their relative `content_path` references.
2. Restart local Supabase to reload templates, if using the Supabase CLI.
3. Run `node scripts/verify-email-templates.cjs` (also part of GitHub CI).
4. Send a test signup, invite, recovery, change-email and OTP to **disposable accounts**, then follow the actual Supabase-generated links to confirm the flow works.
5. Check Gmail/mobile/Outlook layout, images-off appearance, dark-mode legibility, preheaders, spam placement, and broken-link handling.

## Admin Resend notification testing

The `test-email-sender` Edge Function is disabled by default via `ENABLE_TEST_EMAIL_SENDER`. It requires a signed-in admin JWT. When deliberately enabled, it accepts `{ "to": "verified-test-inbox@example.com", "template": "Role Update" }` and sends **one** test template per request. It does not send all templates or use a hardcoded personal mailbox. Keep it disabled in normal production, and verify the destination mailbox before enabling.

Other supported template selectors: Invite, Role Update, Account Deletion, Suspension, Welcome, Generic, Auth - Confirm Signup, Auth - Reset Password, and Auth - Magic Link. These are simulated previews, not usable auth tokens.

## Operational safeguards

- No misleading claims about the exact expiry duration: the configured Supabase token lifetime is authoritative.
- No unescaped HTML from role names, reason text, or arbitrary notification messages.
- Resend delivery failures return a non-success HTTP status; an accepted message ID is **not** proof of inbox arrival.
- Templates have a visible support address and anti-phishing reminder. Verification codes should never be shared.
- Monitor bounced mail, complaint rate, SMTP quota, SPF, DKIM and DMARC through the chosen provider.
- Run the controlled Auth end-to-end test after updating hosted email templates. The current connector cannot edit hosted Supabase Auth template settings directly; manual Dashboard activation is a separate release gate.
