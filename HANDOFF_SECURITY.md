# Security and handoff checklist

## Scope
This repository contains a Vite/React student career-guidance application backed by Supabase Auth, PostgreSQL Row Level Security (RLS), and Edge Functions. The assessment flow gathers student inputs, computes career recommendations, and stores personal results. Shared-result slugs intentionally expose selected result data to anyone with the link.

## Environment
Copy `.env.example` to `.env`; configure the Supabase URL and **publishable** key for the frontend. Never place a service-role key, OAuth client secret, or AI provider key in any `VITE_` variable. Configure Edge Function secrets using Supabase Secrets. Never commit a real `.env` file.

## Access-control invariants
- Authentication: validate the user JWT server-side for every privileged Edge Function.
- Ownership: ensure user_profiles, career_history, saved careers, and other student-scoped rows have RLS policies enforcing `auth.uid() = user_id` (or equivalent ownership). Client-side `.eq('user_id', ...)` is not a security boundary.
- Administration: always check database roles/permissions inside Edge Functions before using the service-role client. Frontend owner-email checks only affect presentation.
- Impersonation: generation requires admin privilege; consumption requires both the originating admin's authenticated JWT and the unexpired single-use token. Never include impersonation tokens in URLs, browser analytics, or logs.
- Sharing: shared-result slugs are bearer links. The public RPC returns a limited summary; only authenticated owners create new links. Owners may revoke their links; admins may view metadata, but must not bypass owner-only deletions.
- Audit: check deployed migrations and policies in production separately from committed SQL.

## Before deployment
1. Run `npm ci && npm run lint && npm test && npm run build`.
2. Run `gitleaks git --redact --report-path gitleaks-report.json` and remediate any verified credential exposure in **history**, rotating leaked secrets.
3. In an isolated Supabase environment, test account A cannot read/update/delete account B's profile, saved careers, history, shared-result drafts, or other private records.
4. Test that unauthenticated and non-admin callers cannot invoke user export, invite, delete, suspension, role update, or impersonation functions.
5. Verify deployed migrations include `20260821000000_harden_rls_and_rpc_access.sql`.
6. Production browser exceptions report minimized event categories to the Cloudflare Pages Function at `/api/client-error`, visible under Pages deployment Function logs. **Configure real alerts** (Logpush/analytics alerting or a Sentry/Datadog integration) and test one alert; logging alone does not deliver notifications. Events intentionally exclude messages, stack traces, query parameters, share-token slugs, and student answers.
7. Configure branch protection with review and CI requirements.
8. Deploy Edge Functions `update-user-profile`, `test-email-sender` and `explain-analysis` with `verify_jwt = true`; verify no browser caller can bypass auth or use a service-role token. Then confirm current production migration and RLS advisors.
9. Use two normal accounts and an admin in a disposable Supabase environment. Prove a normal account cannot query another student's profile, history, bookmarks, share records, or roles. Then prove role-change, user deletion and test-email routes reject non-admins.
10. Do not silently treat PostgREST errors as successful writes. For `.update()`/`.delete()`, `.select('id')` checks whether an authorized row was actually affected.

## Operational notes
Never assume `supabase/functions` code is deployed merely because it appears in Git. Deploy and test functions and migration changes with rollback planning. The consume-impersonation endpoint now requires the initiating admin's bearer JWT; update any external caller that previously sent only the one-time token.

## Release sequence
1. Approve the PR after the complete CI workflow succeeds.
2. Verify the Cloudflare Pages preview, particularly `/api/client-error` and private routes.
3. Roll out the reviewed Supabase permission migration and deploy Edge Functions separately; do not assume GitHub merge deploys them.
4. Check SQL migration history, advisor warnings and account-isolation tests.
5. Promote the Cloudflare Pages frontend and repeat smoke tests including the saved-career insert/remove path and share-link creation/revocation.
6. Verify Cloudflare Function logs record only low-detail telemetry; configure an external alert destination and test delivery.

## Architectural follow-up
The codebase has `src/integrations/supabase/client.ts` as the canonical browser client plus compatibility/server helpers under `src/lib`. The core assessment engine in `src/analysis_engine` is deterministic; its optional LLM narrator is not a score generator. Keep catalog and pathway mappings in sync. Remove unused helpers only after import and integration tests.
