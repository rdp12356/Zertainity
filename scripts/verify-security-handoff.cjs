// Fast static regressions. NOT a replacement for two-user RLS integration tests.
const fs = require("node:fs");
const assert = require("node:assert/strict");
const read = (path) => fs.readFileSync(path, "utf8");

const permission = read("src/hooks/usePermission.tsx");
const admin = read("src/pages/Admin.tsx");
const storage = read("src/hooks/useSavedCareers.ts");
const results = read("src/pages/Results.tsx");
const mail = read("supabase/functions/test-email-sender/index.ts");
const ai = read("supabase/functions/explain-analysis/index.ts");
const migration = read("supabase/migrations/20261026123759_lock_admin_bootstrap_and_private_saved_careers.sql");
const main = read("src/main.tsx");
const serviceWorker = read("public/sw.js");
const responseHeaders = read("public/_headers");
const errorTelemetry = read("src/lib/errorTelemetry.ts");

assert(!permission.includes("if (isOwnerEmail(session.user.email))"), "Never elevate permissions from an email allowlist");
assert(!admin.includes("|| emailIsOwner"), "Admin console must use DB roles");
assert(!admin.includes("supabase.rpc('get_all_users_with_roles')"), "Admin users must be read through authorization-gated function");
assert(storage.includes("zertainity_saved_careers:") && storage.includes("getLocalSavedCareers(nextUserId)"), "Saved careers must be per account");
assert(results.includes("const publicRecommendations =") && !results.includes("analysis: analysis,"), "Do not disclose the complete analysis on public share links");
assert(mail.includes("ENABLE_TEST_EMAIL_SENDER") && mail.includes("admin.auth.getUser") && mail.includes(".from('user_roles')"), "Test mail needs explicit enable plus admin authentication");
assert(ai.includes("authClient.auth.getUser") && ai.includes("MAX_REQUESTS") && ai.includes("rawAnalysis.length"), "Paid narration must have session and limits");
assert(migration.includes('DROP POLICY IF EXISTS "Allow first owner or admin setup"') && migration.includes("REVOKE EXECUTE"), "Lock down admin bootstrap and privileged RPCs");
assert(main.includes("initializeErrorTelemetry()"), "React errors should be forwarded to optional monitoring");
assert(!serviceWorker.includes("cache.put(event.request"), "Never cache arbitrary page responses");

assert(responseHeaders.includes("https://o4511879728070656.ingest.us.sentry.io"), "CSP must allow the Sentry US ingest endpoint");
assert(errorTelemetry.includes("VITE_SENTRY_DSN"), "Monitoring must be configured from an environment variable");
assert(!errorTelemetry.includes("793a994e2b3e5eb5be34951eed1d91dc"), "Do not hardcode the Sentry DSN in tracked source");
console.log("PASS: security, privacy, authentication, monitoring and cache invariants");
