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
- Sharing: shared-result slugs are bearer links. Confirm which fields are public and provide a revoke/unshare path.
- Audit: check deployed migrations and policies in production separately from committed SQL.

## Before deployment
1. Run `npm ci && npm run lint && npm test && npm run build`.
2. Run `gitleaks git --redact --report-path gitleaks-report.json` and remediate any verified credential exposure in **history**, rotating leaked secrets.
3. In an isolated Supabase environment, test account A cannot read/update/delete account B's profile, saved careers, history, shared-result drafts, or other private records.
4. Test that unauthenticated and non-admin callers cannot invoke user export, invite, delete, suspension, role update, or impersonation functions.
5. Verify deployed migrations include `20260821000000_harden_rls_and_rpc_access.sql`.
6. Connect a production error monitoring provider (for example Sentry) and redact tokens, student responses, and personal information. Existing console logs do **not** deliver alerts by themselves.
7. Configure branch protection with review and CI requirements.

## Operational notes
Never assume `supabase/functions` code is deployed merely because it appears in Git. Deploy and test functions and migration changes with rollback planning. The consume-impersonation endpoint now requires the initiating admin's bearer JWT; update any external caller that previously sent only the one-time token.

## Architectural follow-up
The codebase has both `src/integrations/supabase/client.ts` and `src/lib/client.ts`. Confirm call-site usage before removing either. Keep server-only clients separate from browser clients. Evaluate repeated data-access patterns and dead components with TypeScript/lint tooling; do not delete inferred duplicates without regression tests.
