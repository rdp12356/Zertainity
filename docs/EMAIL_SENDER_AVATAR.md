# Zertainity sender avatars — implementation and prerequisites

Checked 27 October 2026.

## What changed in the repository

- `public/zertainity-email-logo.png`: square PNG rendering of the uploaded **original books-and-laurel Zertainity emblem** in its maroon/white colour scheme.
- `public/zertainity-email-logo.svg`: original uploaded vector artwork (not yet BIMI-validated). Website `favicon.svg` and `logo.svg` use the same original artwork.
- `supabase/functions/_shared/email-templates.ts`: the generated HTML for welcome, role change, suspension, deletion and generic Resend notices renders the emblem at 80×80 beside a readable ZERTAINITY wordmark.
- All 13 `supabase/templates/auth/*.html` templates include the same original-logo image at 80×80 and wordmark. Token URLs and OTP placeholders are unchanged.
- `scripts/verify-email-templates.cjs`: permits exactly the vetted first-party image and rejects additional images/tracking pixels.

Email clients may suppress remote images. All templates therefore preserve the visible text wordmark, alt text, original content and fallback action URLs. This is a visual enhancement, not a dependency for login.

## Important: sender profile icon is **not** part of HTML email

The avatar shown beside the sender's name in Gmail/Apple Mail/Yahoo is controlled by the **receiving mailbox provider**, not by Resend or Supabase's `html` property.

### Verified live domain status

- Resend domain `zertainity.in` is verified for sending.
- Cloudflare MX for the main domain currently uses Cloudflare Email Routing, rather than Google Workspace MX. Email routing aliases do not automatically receive Google account avatars.
- The current `_dmarc.zertainity.in` DNS TXT record is `v=DMARC1; p=none; rua=...`. This is **not yet BIMI-eligible**; Gmail-compatible BIMI requires an enforced policy (`p=quarantine` or `p=reject` at 100%).
- The repository does **not** include a verified BIMI SVG or purchased VMC or CMC mark certificate; a separately validated BIMI logo will be supplied by the owner. Gmail generally requires a valid certificate to display a BIMI avatar. A CMC does not provide Gmail's blue verified mark; VMC can.
- No BIMI TXT record has been published in this change.

### To enable inbox sender avatars on multiple providers

1. Inventory **every** genuine `@zertainity.in` sender: Resend `noreply`, Supabase Auth SMTP, any Microsoft/Google accounts and individual aliases. Confirm DMARC alignment (DKIM d= or SPF MAIL FROM) for each with actual mail headers.
2. Review DMARC aggregate reports and **only then** move `_dmarc` from `p=none` through `p=quarantine` to `p=reject`. Premature enforcement can reject legitimate password reset / verification mail.
3. Obtain the certificate required by the target mail providers (VMC or CMC). Certificate authorities validate ownership, acceptable logo usage and format. These are external eligibility/commercial steps; GitHub changes alone cannot provide a certificate.
4. Inspect the separately provided BIMI-validated SVG Tiny PS for format validity and visual consistency with the original logo. The standard site/email SVG is **not** itself certified BIMI Tiny PS. Do not publish BIMI DNS until that distinct SVG and certificate requirements are verified.
5. Upload the certified SVG and certificate bundle over stable HTTPS with public access. Then publish `default._bimi.zertainity.in` as `v=BIMI1; l=<approved SVG URL>; a=<issued certificate URL>`, using the exact URLs provided by the certificate issuer.
6. Re-test Gmail (web/mobile), Yahoo/Apple and other target clients after DNS propagation. Provider support varies. Even a technically valid record does not force every recipient inbox to display the logo.

### If sending via a Google account

A real Google or Google Workspace account can have a profile picture set for that account, subject to each recipient's visibility and account settings. This affects that mailbox's identity, **not all domain senders**, Resend aliases, or Supabase Auth emails.

## Rollout checklist

1. Merge this change and wait until `https://www.zertainity.in/zertainity-email-logo.png` returns HTTP 200 with `image/png` and **not** a bot challenge or SPA HTML.
2. Deploy the `send-notification` Supabase Edge Function with the updated `_shared/email-templates.ts`. A Cloudflare/Vercel frontend deploy alone does not update that server function.
3. In Supabase Dashboard → Authentication → Email Templates, publish and verify the 6 authentication HTML files. Security notification templates are configured separately and only where enabled. The committed `supabase/config.toml` is for local development and doesn't automatically sync hosted templates.
4. Test one controlled notification and real password reset with disposable accounts; verify branding in Gmail with image loading on and off, DKIM/SPF/DMARC `PASS`, and working activation links. Don't replace tokens with mock URLs in production.
5. Record that inbox-avatar display is pending DMARC enforcement and mark certification. Do not promise that all clients show it.

Official references:

- Google Workspace BIMI setup: https://knowledge.workspace.google.com/admin/security/set-up-bimi
- Gmail with CMC: https://workspaceupdates.googleblog.com/2024/09/gmail-additional-bimi-protections.html
- Resend sender avatar overview: https://www.resend.com/blog/email-changes-for-bimi
