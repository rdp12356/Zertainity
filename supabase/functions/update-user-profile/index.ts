import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeadersFor } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  const headers = { ...corsHeadersFor(req.headers.get('origin')), 'Content-Type': 'application/json' };
  if (req.method === 'OPTIONS') return new Response(null, { headers });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Session required' }), { status: 401, headers });

  try {
    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    const { data: { user }, error: authError } = await admin.auth.getUser(authHeader.slice(7));
    if (authError || !user) return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401, headers });

    const { data: roleRows, error: roleError } = await admin
      .from('user_roles').select('role').eq('user_id', user.id).in('role', ['admin', 'owner']);
    if (roleError || !roleRows?.length) {
      return new Response(JSON.stringify({ error: 'Administrator role required' }), { status: 403, headers });
    }
    const { userId, updates } = await req.json();
    if (typeof userId !== 'string' || !/^[0-9a-f-]{36}$/i.test(userId)
      || !updates || typeof updates !== 'object' || Array.isArray(updates)) {
      return new Response(JSON.stringify({ error: 'Invalid profile update request' }), { status: 400, headers });
    }
    const allowed: Record<string, number> = { display_name: 120, phone_number: 40, location: 160, bio: 1500 };
    const safeUpdates: Record<string, string | null> = {};
    for (const [field, value] of Object.entries(updates)) {
      if (!(field in allowed) || (value !== null && typeof value !== 'string')) {
        return new Response(JSON.stringify({ error: 'Unsupported field' }), { status: 400, headers });
      }
      if (typeof value === 'string' && value.length > allowed[field]) {
        return new Response(JSON.stringify({ error: 'Field too long: ' + field }), { status: 400, headers });
      }
      safeUpdates[field] = value;
    }
    if (!Object.keys(safeUpdates).length) {
      return new Response(JSON.stringify({ error: 'No permitted changes' }), { status: 400, headers });
    }

    // Admins must not change the profile of an owner; owners may do so.
    const { data: targetRoles, error: targetRolesError } = await admin
      .from('user_roles').select('role').eq('user_id', userId);
    if (targetRolesError) throw targetRolesError;
    if (targetRoles?.some(r => r.role === 'owner') && !roleRows.some(r => r.role === 'owner')) {
      return new Response(JSON.stringify({ error: 'Owner profile protected' }), { status: 403, headers });
    }

    const { data: updated, error: updateError } = await admin
      .from('user_profiles').update(safeUpdates).eq('id', userId).select('id').maybeSingle();
    if (updateError) throw updateError;
    if (!updated) return new Response(JSON.stringify({ error: 'Profile not found' }), { status: 404, headers });
    const { error: auditError } = await admin.from('audit_log').insert({
      user_id: user.id,
      target_user_id: userId,
      action: 'admin_profile_updated',
      after_snapshot: { fields: Object.keys(safeUpdates) },
    });
    if (auditError) console.error('Profile updated but audit log insertion failed', auditError);
    return new Response(JSON.stringify({ success: true }), { headers });
  } catch (error) {
    console.error('Administrator profile update failed', error);
    return new Response(JSON.stringify({ error: 'Profile update failed' }), { status: 500, headers });
  }
});
