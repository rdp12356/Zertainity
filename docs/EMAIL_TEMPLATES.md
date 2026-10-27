# Zertainity transactional email system

All email markup is designed to be accessible in Gmail, Outlook and mobile clients: responsive HTML tables, system fonts, one fixed-size first-party Zertainity logo (with text fallback), no tracking pixels, high-contrast CTAs and a plain secure-link fallback. The shared Resend notification builder escapes user-provided fields.

## Email logo and sender avatar

All checked-in email templates now use a square PNG rendition of the uploaded original books-and-laurel emblem at `https://www.zertainity.in/zertainity-email-logo.png`, displayed at 80×80 pixels beside a text wordmark. The matching vector source is `public/zertainity-email-logo.svg`. Image blocking must not hide the sender identity or action links.

The logo **inside an email** is separate from the **round sender avatar in a recipient's inbox**. Gmail, Outlook and other clients decide which avatar to show. Sending a normal HTML image, setting a From name, or configuring a favicon does **not** control those inbox avatars. See `docs/EMAIL_SENDER_AVATAR.md` for BIMI and DNS prerequisites.

Before deploying notifications, verify that the PNG asset is publicly accessible as an image on the canonical domain. Hosted Supabase Auth templates still require manual update in the Dashboard; publishing source files is not enough.

## Production routing — critical distinction

**Supabase Auth** sends invitations, signup confirmation, password recovery, magic links, email change and reauthentication emails. Its hosted Auth email templates are configured **in the Supabase Dashboard, not via GitHub migrations or \`supabase/config.toml\`**.

**Resend** through \`supabase/functions/send-notification\` sends administrative role changes, suspension, deletion, welcome and generic operational messages. Its template source is \`supabase/functions/_shared/email-templates.ts\`. Existing admin authorization is enforced before sending.

An invitation is now **one email** sent by \`auth.admin.inviteUserByEmail\` using the genuine \`{{ .ConfirmationURL }}\` token. Do not add a second branded notification without an activation link. For \`resend-invite\`, Supabase Auth similarly sends the actionable email.

## Activate hosted Supabase Auth designs

1. Open [Supabase Auth Email Templates](https://supabase.com/dashboard/project/lsnhzyknfuufscnpixve/auth/templates) for the **Zertainity** project.
2. Select the corresponding template type below, copy the complete HTML source of the indicated file into its **HTML body**, set the subject, and save. Do this for all six authentication templates.
3. In the Dashboard's security notifications section, review which account-security notifications are **enabled**, then configure the corresponding seven templates as needed. Enabling a notification is a separate setting; committing HTML cannot enable hosted notifications.
4. Set and verify Site URL and redirect allow-list (including \`https://www.zertainity.in\`, \`https://zertainity.in\` and your approved auth/reset callback URLs), sender name, authenticated email-sending provider, SPF/DKIM records, and correct sender domain.
5. Disable click tracking and link rewriting for transactional Auth emails in your email provider; rewritten or pre-fetched one-time URLs may fail.
6. Test confirmation, invitation and password reset with **disposable test accounts and actual email links**. Do not use mock tokens for functional verification. Test resend, expired-link and invalid-token behavior without changing existing student accounts.
7. Validate that the redirect after password recovery reaches \`/reset-password\`, and that a new invitation leads into the supported account setup / login flow. If the Auth project's "Confirm email" option is disabled, enable it according to your intended signup policy.
8. Record the installation date, Dashboard configuration, sender verification, and test results in the release checklist; keep private SMTP keys in Supabase, never in \`VITE_\` variables or Git.

### Hosted Auth HTML and subjects

| Dashboard flow | File | Subject |
| --- | --- | --- |
| Confirm signup | \`supabase/templates/auth/confirmation.html\` | Verify your email \| Zertainity |
| Invite user | \`supabase/templates/auth/invite.html\` | You're invited to Zertainity |
| Reset password | \`supabase/templates/auth/recovery.html\` | Reset your password \| Zertainity |
| Magic link / OTP | \`supabase/templates/auth/magic_link.html\` | Your sign-in link \| Zertainity |
| Change email | \`supabase/templates/auth/email_change.html\` | Confirm your new email \| Zertainity |
| Reauthentication | \`supabase/templates/auth/reauthentication.html\` | Your verification code \| Zertainity |

The five action-link templates retain \`{{ .ConfirmationURL }}\` in both a CTA and an accessible fallback link. Reauthentication uses \`{{ .Token }}\` instead. **Do not replace placeholders with hardcoded URLs**; use the originals from Supabase's Auth renderer.

### Security notifications

| Dashboard event | File |
| --- | --- |
| Password changed | \`password_changed.html\` |
| Email address changed | \`email_changed.html\` |
| Phone number changed | \`phone_changed.html\` |
| Sign-in method linked | \`identity_linked.html\` |
| Sign-in method removed | \`identity_unlinked.html\` |
| Verification method added | \`mfa_factor_enrolled.html\` |
| Verification method removed | \`mfa_factor_unenrolled.html\` |

All files are inside \`supabase/templates/auth/\`. Security notifications explain what happened and provide a way to review account settings; they intentionally **do not include sign-in or recovery tokens**.

## Local Supabase CLI

\`supabase/config.toml\` references the same files via \`[auth.email.template.*]\` and \`[auth.email.notification.*]\` for local development only. Use the latest Supabase CLI and restart the local stack after changes. These settings **do not sync to the hosted Auth dashboard**.

## Verification

Run \`node scripts/verify-email-templates.cjs\` (also included in CI). It checks all 13 files for branding, accessible markup, authentication placeholders, no trackers or scripts, and a single secure invitation path.

A green static test is **not** proof that the hosted Supabase Auth settings were changed or that the email arrived in an inbox. Verify deliverability and correct redirect behavior with controlled end-to-end tests.

## Production rollout

The Resend notification Edge Function and any callers importing its shared module must be deployed separately from the Cloudflare frontend. An Edge Function deployment replaces the live code immediately. Deploy these functions with their shared dependencies and keep \`verify_jwt = true\` for administrative endpoints. Never deploy test-email-sender enabled by default. There should be no real-user invitation during visual QA unless that user is intentionally being invited.
