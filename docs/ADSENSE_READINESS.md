# Zertainity AdSense readiness and verification

Updated 2026-10-28. This is a technical checklist, **not a guarantee of approval or a statement of live AdSense account status**.

## Repository implementation

- The homepage HTML contains the AdSense ownership meta tag for `ca-pub-4407603057931203`.
- `public/ads.txt` contains `google.com, pub-4407603057931203, DIRECT, f08c47fec0942fa0`.
- `public/robots.txt` permits crawling and points to the public sitemap.
- The React ad loader excludes login, admin, private account and assessment routes. Optional analytics/advertising scripts require explicit visitor consent.
- Verify the deployed HTML and the root-domain `/ads.txt` responses, not just the tracked files. Verify both `zertainity.in` and `www.zertainity.in`, redirects, HTTPS and robots behavior. A 200 SPA fallback containing HTML **is not** a valid `ads.txt` response.

## Live verification performed 2026-10-28

| Check | Observed result | Meaning |
| --- | --- | --- |
| `https://www.zertainity.in/ads.txt` | HTTP 200, text/plain and expected publisher declaration | Correct public seller file |
| `https://www.zertainity.in/` | HTTP 403 with Cloudflare "Just a moment" challenge to automated audit client | **Needs Cloudflare Security Events investigation**; not evidence every human or Googlebot is blocked |
| `/careers`, `/about`, `/contact`, `/privacy-policy`, `/terms-of-service` | HTTP 403 to same automated client | Possible crawl/index/review obstacle; compare verified Google crawler logs before WAF changes |
| `/sitemap.xml` | HTTP 403 to same audit client | Verify valid sitemap is accessible without a challenge to Googlebot |
| Cloudflare WAF | Custom challenges for nonverified curl/wget/python clients plus Bot Fight Mode | Do not globally disable security; review exact challenge rule/event and verified bot signals |

**Release blocker:** Confirm legitimate Google AdSense and Search crawlers receive full page content. Cloudflare JavaScript challenges should not be applied to verified crawler traffic. Cloudflare event analytics plus Search Console **URL Inspection** are required to establish the actual crawler outcome. User-agent string spoofing is not sufficient to prove a request is verified Googlebot.

**Content:** Google may reject thin, inaccessible, incomplete or poorly navigable sites. A React SPA's HTTP 200 status by itself does not prove substantive content is visible to the AdSense review process. Inspect rendered page text and server responses. Do not place ads over account sign-in, student assessments, empty results or errors.

**Consent:** This website's custom optional-cookie dialog is not a Google-certified TCF CMP. To serve personalized ads to EEA/UK/Swiss visitors, configure a Google-certified CMP through **AdSense → Privacy & messaging** and validate its resulting consent signals. Do not claim the custom banner satisfies that requirement by itself.

**Account eligibility:** AdSense requires a publisher account owner aged at least 18. When the website operator is younger, an eligible adult may apply and hold the account. Never falsify age.

**Publisher status:** Only the AdSense account's **Sites** and **Policy center** can confirm approved/ready. GitHub, Cloudflare, Supabase and test builds cannot approve the site.

## Publisher/account checks (manual in Google AdSense)

1. Open **AdSense → Sites → zertainity.in** and read the exact **Approval** and **ads.txt** statuses. Match the publisher ID in this project's files against the one shown in the account. If the account uses a different publisher ID, fix the website deliberately rather than guessing.
2. Choose the **meta tag** or **ads.txt** site verification method if the ad loader is consent-gated. Verify Google sees the actual live metadata/content. Do not claim the site is ready simply because the build passes.
3. Confirm the AdSense account applicant is at least 18 years old; if not, an eligible parent or guardian must use their own AdSense account. Google handles payments to that adult.
4. Review unique, substantial publicly accessible content on home, careers, individual career descriptions, exams, methodology, about, contact, privacy and terms pages. Remove dead links, thin pages and placeholders. Do not put ads on sign-in, error, empty or personalized assessment pages.
5. Keep accurate, functional privacy disclosures and visitor preferences. For applicable EEA, UK and Swiss traffic, check Google-certified CMP requirements; this website's own opt-in banner **is not represented as a Google-certified CMP**.
6. Check Google Search Console for crawl/index coverage and sitemap submissions. Site verification and search indexing are different from AdSense approval.
7. When all issues in **Sites** are addressed, select **Request review** (if offered). Review can take time, and only Google can approve or reject.

## Local checks

```bash
node scripts/verify-site-readiness.cjs
npm run lint
npx tsc --noEmit
npm test -- --ci
npm run build
```

After deployment, run `node scripts/verify-live-cloudflare.cjs` from a network that can reach the public site; verify its output and recheck the root-domain ads.txt separately.

Official guidance:
- https://support.google.com/adsense/answer/7584263
- https://support.google.com/adsense/answer/12176698
- https://support.google.com/adsense/answer/9724
- https://support.google.com/adsense/answer/81904
- https://support.google.com/adsense/answer/13554116
