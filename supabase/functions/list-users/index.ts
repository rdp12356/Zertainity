import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication token' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 });
    }

    const { data: requestorRoles, error: roleCheckError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'owner']);

    if (roleCheckError || !requestorRoles || requestorRoles.length === 0) {
      return new Response(JSON.stringify({ error: 'Only admins and owners can view users' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 });
    }

    const [usersResult, profilesResult, suspendedResult, rolesResult] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers(),
      supabaseAdmin.from('user_profiles').select('*'),
      supabaseAdmin.from('suspended_users').select('user_id'),
      supabaseAdmin.from('user_roles').select('user_id, role'),
    ]);

    if (usersResult.error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch auth users' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
    }

    const profilesMap = new Map((profilesResult.data || []).map((profile: any) => [profile.id, profile]));
    const suspendedSet = new Set((suspendedResult.data || []).map((row: any) => row.user_id));
    const rolesMap = new Map<string, string[]>();

    (rolesResult.data || []).forEach((row: any) => {
      const currentRoles = rolesMap.get(row.user_id) || [];
      currentRoles.push(row.role);
      rolesMap.set(row.user_id, currentRoles);
    });

    const users = usersResult.data.users.map((authUser: any) => ({
      id: authUser.id,
      email: authUser.email || '',
      created_at: authUser.created_at,
      last_sign_in_at: authUser.last_sign_in_at || null,
      invited_at: authUser.invited_at || authUser.created_at || null,
      is_pending_invite: !authUser.confirmed_at,
      roles: rolesMap.get(authUser.id) || [],
      profile: profilesMap.get(authUser.id) || null,
      is_suspended: suspendedSet.has(authUser.id),
    }));

    return new Response(JSON.stringify({ users }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});
