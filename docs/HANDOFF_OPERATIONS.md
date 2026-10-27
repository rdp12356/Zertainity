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

## Verified administrator access and Studio routing
- Dedicated administration host: `https://admin.zertainity.in` (same Cloudflare Pages build, separate browser session origin). Its login route is `/auth`; dashboard `/`; section routes: `/users`, `/colleges`, `/schools`, `/careers`, `/assessments`, `/shared`, `/logs`, `/permissions`, `/export`.
- Supabase has a restricted server-side entitlement roster for `johan.manoj@zertainity.in`, `viney.ragesh@zertainity.in`, and `admin@zertainity.in`. A trigger grants the `owner` role **only once the matching account's email has been verified** by Supabase Auth. This does not circumvent sign-in, prove mailbox control or turn the admin host into a public owner portal.
- Existing Gmail accounts and their student/administrative records remain separate. Domain aliases do not automatically merge account identities; email changes or a data migration need authenticated account-owner approval.
- Owner permissions administer Zertainity's database-managed content, accounts and platform settings. GitHub merges, Cloudflare deployments and environment secrets require independently granted access to those services.
- Never display privileged role assignments based on the email string in browser code. The frontend must request the signed-in user's roles from the server and fail closed on unconfirmed accounts. Use separate accounts and MFA for privileged users when supported; do not share one login.
- Admin data loading is section-scoped to minimize background requests and Realtime channels. The unknown-route screen must link to valid Studio sections, not the public site's student URLs.

## Local setup
1. Install the Node version in `.nvmrc`, then `npm ci`.
2. Copy `.env.example` to `.env`. Set only publishable `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in browser variables.
3. Run `npm run dev` (Vite port 8080), `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`.
4. Edge secrets such as `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, and `OPENROUTER_KEY_1` live ONLY in Supabase Secrets. Never put them in `VITE_` or Git.
5. The `test-email-sender` function requires a valid admin JWT and `ENABLE_TEST_EMAIL_SENDER=true` in Supabase Secrets; keep this feature disabled otherwise.
6. `explain-analysis` is for signed-in users with rate and payload limits. Provider-wide spending quotas are still required for robust abuse prevention.

## Data flow
Assessment form -> deterministic analysis engine -> in-browser result -> `career_history` owned by auth user. Only after a user explicitly presses **Share/Create share link** does the frontend insert a public summary into `shared_results`; viewing results never publishes a link. Holders use `get_shared_result_by_slug`, not direct table access.
Students' saved careers use live `public.user_saved_careers.career_slug`, not the obsolete `career_id` field or a join to `careers`. They are scoped by account in browser storage, with RLS ownership in Supabase; the client verifies every confirmed insert/delete and migrates previously local-only bookmarks. Administrative calls that use a service-role client check the requester's JWT and server-side roles first.

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
- Frontend telemetry: `VITE_SENTRY_DSN` is configured in Cloudflare Pages **production** settings; the configured Sentry ingest host is allowlisted in `public/_headers`. This existing lightweight collector receives uncaught browser errors, unhandled rejections, and React boundary failures. It reports only error type and sanitized route — **not full stack traces, personal data, credentials, assessment answers or request bodies**. The supplied Sentry template's `document.getElementById("app")` is not applicable; the existing application mounts once at `#root` in `src/main.tsx`. It does not install or initialize the official `@sentry/react` SDK. Confirm a test event in Sentry's Issues view and configure the project's alert frequency and recipients. For full SDK stack tracing, add `@sentry/react` and a carefully reviewed `beforeSend` privacy filter in a separate change.
- Edge Function logs: use Supabase logs and alert rules; the absence of browser logs does not imply absence of errors.
- Python renderer: stdout logging; connect hosting log collection and investigate non-2xx generation responses.
- If incident involves student records or role escalation, revoke offending access and session, restrict impacted endpoint, preserve audit records and follow documented notification/privacy procedures.

## Remaining maintenance work
- Consolidate overlapping career datasets only after verifying catalog tests and routes; do not delete content based on name similarities.
- Audit dormant compatibility/SSR modules, alternate PDF backends, and `package.json` tooling scripts against the actual file tree.
- Reconcile live dataset volumes with source ingestion plans, using verified government sources and backups.
- Supabase advisors: review the remaining intentional SECURITY DEFINER wrappers, mutable search paths, public `pg_trgm`, leaked-password protection and RLS performance advisories.
- Obtain baseline and after-change Lighthouse/field Core Web Vitals metrics; no unconditional speed claim can be made from a green build.

## Outstanding managed-service configuration and residual risks (2026-10-26)
- The **Python PDF hosting environment** must set a strong `PDF_SERVICE_SECRET`, identical to the server-side Supabase Edge secret. The updated renderer intentionally rejects all rendering requests if the secret is absent. Deploy the Python service only after configuring and verifying both environments. Never expose this secret to browsers or `VITE_*` settings.
- Rendered HTML cannot load external HTTP(S), file, or local network resources in the hardened Python code. Verify document styling and use embedded `data:` assets as needed. Protect the renderer with network access controls and concurrency limits in its hosting service.
- `support-chat` remains publicly accessible for static help. Paid AI responses require a verified signed-in account and a durable per-account quota in `api_request_limits`. Anonymous visitors receive static answers. Provider spending caps and network-layer abuse controls remain recommended.
- `explain-analysis` uses gateway JWT verification plus server-side user verification and a durable user quota.
- GitHub branch protection for `ui-revamp` and Supabase Auth leaked-password protection must be enabled in their respective service dashboards; no direct setting-control connector is available here.
- Set Sentry alert notifications in the Sentry project. The current frontend reporter intentionally omits error messages and stacks for student privacy; the PDF renderer needs host-level logging/alerts.
- Run a real two-user integration test (not just read-only SQL impersonation) and an independent penetration test before a security assurance claim. Never claim the site has zero unknown vulnerabilities.

## Student workflow acceptance checks
1. Guest: bookmark a career, reload: the guest bookmark persists locally. Guest data never silently appears in another signed-in account.
2. Signed-in A: save a career, reload and sign out/in: the `career_slug` record persists on the server. Remove it and confirm **exactly one** server row was deleted. Failed writes must produce a destructive toast rather than a success toast.
3. Signed-in B on the same browser: A's saved careers must not appear. Repeat in a separate browser session.
4. Open an assessment result: `shared_results` count must not increase. Press **Create share link**: count increases by exactly one and the page can copy the URL. Copy again: no second record created. The public response contains no raw marks, analysis snapshot or student name.
5. Use disposable users A/B in a transaction that is rolled back: B must not change A's saved-career record or private profile; no permanent test data remains.
6. Owner/admin edits another user's profile through `update-user-profile` with JWT and server role check; an ordinary student must receive HTTP 403. Verify the change affected exactly one row and audit metadata records only the changed field names (no PII field values).
7. Admin console must show an error, not success, for RLS-denied or zero-row delete operations. Audit-log deletion should stay restricted.

## Managed-service release gates (manual)
- Configure GitHub branch rulesets/protection for `ui-revamp`: require PR review, passing security-quality and CodeQL status, block force pushes. Repository automation currently has no branch-protection write access.
- Configure Sentry Issues alert recipients, then trigger a sanitized test event. Verify that an actual email or notification is delivered; accepted ingestion is not sufficient.
- Verify the separate Python PDF renderer's `PDF_SERVICE_SECRET` matches the Supabase Edge secret. Verify authorized PDF download and rejection with absent/wrong secret; never commit or transmit the secret to Git.
- Confirm Supabase Auth leaked-password protection is enabled in the project's dashboard (plan availability may vary).
- Run a dedicated penetration test and compare Lighthouse / Core Web Vitals before declaring a quantitative performance improvement.

## Remediation rollout (2026-10-27, staged)
- Apply `20261027051607_handoff_remediation_20261027.sql` before replacing `update-user-role` or `update-user-profile`. The two new service-role-only RPCs make role/profile mutations and audit rows transactional.
- RLS does not cover table-level TRUNCATE/REFERENCES/TRIGGER privileges; the migration revokes these from browser-facing roles, retaining normal SELECT/INSERT/UPDATE/DELETE grants and existing records.
- New assessment share links require authentication and attach an owner. Existing anonymous historical links remain readable through the token-scoped RPC.
- When deploying functions, include their imported `_shared/cors.ts`; keep JWT verification enabled. Confirm denied student attempts and successful owner action with two disposable accounts.
- Verify Sentry Issues notification delivery, GitHub branch ruleset, Supabase Auth leaked-password protection, PDF service secrets, and deployment of hosted Auth templates in their respective provider dashboards. These controls are not configured by merging source code.
