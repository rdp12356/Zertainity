# Zertainity repository layout and ownership

Updated 2026-10-28. This map describes what runs in production and which directories are reference-only.

| Path | Purpose | Change policy |
| --- | --- | --- |
| `src/pages/` | Student and Studio route screens | Route tests and authorization review |
| `src/components/`, `src/hooks/` | Shared UI and stateful behaviors | Prefer reusable hooks; avoid duplicating auth checks |
| `src/analysis_engine/` | Deterministic assessment calculations | Keep scoring output stable with regression tests |
| `src/lib/assessmentEngine.ts` | Adapts form answers to analysis engine | Keep separate from core scoring engine |
| `src/data/`, `src/data/career_details/` | Authored career/exam content and adapters | No blind deletion/merging; catalog is consumed in several forms |
| `src/integrations/supabase/` | Typed browser publishable-key client | Never place service-role or API secrets here |
| `supabase/migrations/` | Ordered database DDL and policy history | Append-only, reviewed, deployed separately from frontend |
| `supabase/functions/` | Deployed Edge API endpoints | Server-side JWT, permissions, quotas and secrets |
| `supabase/functions/_shared/` | Common CORS and email-template functions | Extract auth checks here after contract tests |
| `supabase/templates/auth/` | Hosted Auth HTML source | Sync separately through approved Management API workflow |
| `backend/` | Python FastAPI PDF renderer | Separate deployment with private PDF_SERVICE_SECRET |
| `public/` | Favicons, public text assets, sitemap, CSP/robots | Never store sensitive output; verify actual HTTP Content-Type |
| `scripts/` | Release validators, build utilities, CI routines | No binary fixtures mixed with scripts |
| `tests/fixtures/legacy-file-sort/` | Preserved unrelated file-management test fixtures | Not part of the website runtime or production assets |
| `design-md/` | Reference design systems from many brands | Reference-only; do not bundle into the student app |
| `.github/workflows/` | CI, security analysis, optional legacy GitHub Pages deployment | Cloudflare Pages `ui-revamp` is the actual production release |

## Deliberate boundaries

- Preserve Git history, Supabase migration order and public URLs. Renaming those without deploy coordination breaks production.
- Move sample files with Git blob integrity (preserve bytes), not delete them as “junk.” File-sort fixtures were moved from `scripts/test-*` to `tests/fixtures/legacy-file-sort/` without content changes.
- `careersCatalog.ts`, `careersData.ts`, and `careerRoleDetails.ts` currently serve distinct UI shapes; consolidate only after a regression matrix proves parity.
- The two client toast modules are **one implementation** plus a re-export, not duplicate behavior.
- `supabase/functions/analyze` is a legacy readiness endpoint, not the authoritative assessment engine. Do not delete its live function until edge invocation logs, consumers, and deprecation plan are confirmed.
- The `main`-only GitHub Pages workflow is **legacy**; retain it until the maintainer confirms that old public URLs and Pages deployments are no longer needed.
- Keep test fixtures out of `public/`. User-uploaded educational datasets and documents must never be committed without data/rights checks.

## Engineering release checklist

1. PR from `ui-revamp`, green TypeScript, lint, unit tests, security static checks, Gitleaks, dependency audit, CodeQL and build.
2. Confirm Cloudflare Pages deployed the merge SHA. Check `/`, `/careers`, `/exams`, `/about`, `/contact`, `/privacy-policy`, `/terms-of-service`, `/robots.txt`, `/sitemap.xml`, and `/ads.txt` with normal browser **and** automated crawler.
3. Test real authentication (email, OAuth, recovery), two distinct student accounts, admin deny/allow cases, share links and PDF generation without production student data.
4. Roll out migrations and Edge Functions independently; verify deployed versions and rollback plan.
5. Sentry should record a sanitized synthetic event and alert its configured recipient; log collection alone is not incident notification.
6. Google AdSense approval, account-owner age, AdSense site status and a Google-certified CMP are managed outside GitHub. See `docs/ADSENSE_READINESS.md`.
