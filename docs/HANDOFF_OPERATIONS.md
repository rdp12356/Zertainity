# Zertainity operations and security handoff
Updated: 2026-10-26. This file describes implementation as verified in code, not a guarantee of production uptime.

## Source of truth and runtime
- GitHub: `rdp12356/Zertainity`, production branch `ui-revamp`, via reviewed PRs.
- Hosting/DNS: Cloudflare Pages project `zertainity`, domains `www.zertainity.in` and `zertainity.in`.
- Identity, data, RLS and Edge Functions: Supabase project `lsnhzyknfuufscnpixve`.
- Frontend: React 19, Vite 6, TypeScript, React Router 7, Tailwind.
- Deterministic academic analysis: `src/analysis_engine/engine.ts`; assessment adapter `src/lib/assessmentEngine.ts`; results in `src/pages/Results.tsx`.
- Additional AI narration is optional and should not change calculated values.
- Admins: `user_roles` and permission tables determine authority. Email addresses and frontend route guards are not an authorization boundary.
- PDF: `src/utils/pdfGenerator.ts` builds report HTML, `supabase/functions/generate-pdf` proxies to Python FastAPI / WeasyPrint renderer.
- Student records: profile, career history, analysis results, saved careers and private shared-result tokens are sensitive.

## Local setup
1. Install the Node version in `.nvmrc`, then `npm ci`.
2. Copy `.env.example` to `.env`. Set only publishable `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in browser variables.
3. Run `npm run dev` (Vite port 8080), `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`.
4. Edge secrets such as `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, and `OPENROUTER_KEY_1` live ONLY in Supabase Secrets. Never put them in `VITE_` or Git.
5. The `test-email-sender` function requires a valid admin JWT and `ENABLE_TEST_EMAIL_SENDER=true` in Supabase Secrets; keep this feature disabled otherwise.
6. `explain-analysis` is for signed-in users with rate and payload limits. Provider-wide spending quotas are still required for robust abuse prevention.

## Data flow
Assessment form -> deterministic analysis engine -> in-browser result -> `career_history` owned by auth user. When a share link is generated, only a public summary is inserted into `shared_results`; holders use `get_shared_result_by_slug` and the full student analysis is not newly disclosed.
Students' saved careers are scoped by account in browser storage, with RLS ownership in Supabase. Administrative calls that use a service-role client check the requester's JWT and server-side roles first.

## Security regression test matrix (must test using isolated, disposable A and B accounts)
1. A cannot SELECT/UPDATE/DELETE B's profile, analysis results, saved careers, history or shared drafts. B likewise cannot access A.
2. A cannot invoke admin role changes, test email, user export/delete, suspension, or impersonation.
3. An administrator with a real `user_roles` row can perform only explicitly authorized operations.
4. Revoking the admin role immediately denies new privileged actions even if frontend state remains stale.
5. Public `/r/:slug` returns only summary columns; invalid slugs yield no row. User identities and raw assessment answers must never be sent to error telemetry.
6. Without any owner/admin, only the configured `setup-admin` service-role bootstrap can initialize an administrator. Direct inserts must remain restricted.
7. Review all SECURITY DEFINER RPCs and run Supabase security advisors after changes.

## Deploy and rollback
- Make a feature branch, open a PR, require green CI and review.
- Apply reviewed SQL migrations *once* to the intended Supabase environment, then verify privileges with read-only SQL. Keep schema and production branch versions matched.
- Deploy Edge Function entrypoint plus its relative dependencies and validate the deployed version and JWT requirement. Do not assume Git changes deploy functions.
- Merge to `ui-revamp` only once gates pass. Cloudflare Pages deploys that branch. Confirm latest canonical deployment commit SHA.
- After deploy, smoke check `/`, `/careers`, `/exams`, `/robots.txt`, `/sitemap.xml`, `/auth`, `/admin`, and private-route `X-Robots-Tag` headers; test a real signed-in user journey.
- For rollback, redeploy previous known-good Cloudflare Pages build; separately restore Edge Function versions and coordinate compatible database changes. Never assume rolling back frontend also undoes migrations. Avoid reversing permissions without review.

## Monitoring and incident response
- Frontend telemetry: set `VITE_SENTRY_DSN` in Cloudflare Pages production build variables to activate optional sanitized error reporting, then configure Sentry alerts. No token, full URL, stack, or assessment body is transmitted by this integration. Check CORS/CSP and confirm a test event before calling it operational.
- Edge Function logs: use Supabase logs and alert rules; the absence of browser logs does not imply absence of errors.
- Python renderer: stdout logging; connect hosting log collection and investigate non-2xx generation responses.
- If incident involves student records or role escalation, revoke offending access and session, restrict impacted endpoint, preserve audit records and follow documented notification/privacy procedures.

## Remaining maintenance work
- Consolidate overlapping career datasets only after verifying catalog tests and routes; do not delete content based on name similarities.
- Audit dormant compatibility/SSR modules, alternate PDF backends, and `package.json` tooling scripts against the actual file tree.
- Reconcile live dataset volumes with source ingestion plans, using verified government sources and backups.
- Supabase advisors: review the remaining intentional SECURITY DEFINER wrappers, mutable search paths, public `pg_trgm`, leaked-password protection and RLS performance advisories.
- Obtain baseline and after-change Lighthouse/field Core Web Vitals metrics; no unconditional speed claim can be made from a green build.
