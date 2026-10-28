// Static release guard; integration tests must still verify two real sessions.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const load = file => fs.readFileSync(file,'utf8');
const migration = load('supabase/migrations/20261027051607_handoff_remediation_20261027.sql');
const role = load('supabase/functions/update-user-role/index.ts');
const profile = load('supabase/functions/update-user-profile/index.ts');
const pdf = load('backend/main.py');
const result = load('src/pages/Results.tsx');
assert(migration.includes('REVOKE TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public'));
assert(migration.includes('GRANT EXECUTE ON FUNCTION public.owner_replace_user_role'));
assert(migration.includes('GRANT EXECUTE ON FUNCTION public.admin_update_profile_audited'));
assert(migration.includes('WITH CHECK ((SELECT auth.uid()) = user_id AND user_id IS NOT NULL)'));
assert(role.includes(".rpc('owner_replace_user_role'"));
assert(!role.includes(".from('user_roles')\n        .delete()"));
assert(role.includes('notificationResponse.ok'));
assert(profile.includes('.rpc("admin_update_profile_audited"'));
assert(!profile.includes('.from("user_profiles").update(changes)'));
assert(!pdf.includes('author={meta_author}'));
assert(result.includes('if (!session?.user?.id)'));
assert(result.includes('user_id: session.user.id'));
const studio = load('src/pages/Admin.tsx');
const pdfOne = load('src/hooks/usePdfDownload.tsx');
const pdfBatch = load('src/hooks/usePdfBatch.ts');
const policy = load('SECURITY.md');
assert(!/handleDelete(?:ActivityLog|AuditLog|CareerHistory|SharedResult)/.test(studio),
  'Studio must not offer forbidden or unused browser-side destructive mutations');
assert(studio.includes('captureAppError(error, "studio.admin-action")'),
  'Admin failures must reach sanitized telemetry');
assert(pdfOne.includes('captureAppError(error, "pdf.download")'));
assert(pdfBatch.includes('captureAppError(error, "pdf.batch")'));
assert(policy.includes('ui-revamp') && !policy.includes('Latest` (`main'),
  'Support policy must identify deployed branch');
assert(require('node:fs').existsSync('docs/REPOSITORY_STRUCTURE.md'),
  'Provide a repository layout map for successor maintainers');
assert(require('node:fs').existsSync('tests/fixtures/legacy-file-sort/test-project-sort-src/AlphaApp/package.json'),
  'Keep legacy file-sort fixtures safely outside application scripts');
assert(!require('node:fs').existsSync('scripts/test-project-sort-src/AlphaApp/package.json'),
  'Legacy file fixture must not linger under scripts');
console.log('PASS: least privileges, atomic admin writes, notification status and share ownership');
