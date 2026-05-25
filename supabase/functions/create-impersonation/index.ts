import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Authorization required' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 });

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) return new Response(JSON.stringify({ error: 'Invalid auth token' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 });

    const body = await req.json();
    const { targetUserId } = body;
    if (!targetUserId) return new Response(JSON.stringify({ error: 'targetUserId required' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });

    // Verify caller is admin
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin','owner']);

    if (rolesError) return new Response(JSON.stringify({ error: 'Failed to verify roles' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
    if (!roles || roles.length === 0) return new Response(JSON.stringify({ error: 'Not authorized' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 });

    const tokenValue = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

    const { error: insertErr } = await supabaseAdmin
      .from('impersonations')
      .insert({ token: tokenValue, admin_id: user.id, target_user_id: targetUserId, expires_at: expiresAt });

    if (insertErr) {
      console.error('Insert impersonation error:', insertErr);
      return new Response(JSON.stringify({ error: 'Failed to create impersonation token' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
    }

    return new Response(JSON.stringify({ token: tokenValue, expires_at: expiresAt }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
  } catch (error) {
    console.error('Unexpected error in create-impersonation:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});
