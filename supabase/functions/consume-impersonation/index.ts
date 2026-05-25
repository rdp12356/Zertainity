import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { token } = body;
    if (!token) return new Response(JSON.stringify({ error: 'token required' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: rows, error: selErr } = await supabaseAdmin
      .from('impersonations')
      .select('*')
      .eq('token', token)
      .limit(1)
      .maybeSingle();

    if (selErr) {
      console.error('Select impersonation error:', selErr);
      return new Response(JSON.stringify({ error: 'Failed to lookup token' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
    }

    const row = rows;
    if (!row) return new Response(JSON.stringify({ error: 'Token not found' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 });
    if (row.used) return new Response(JSON.stringify({ error: 'Token already used' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
    if (new Date(row.expires_at) < new Date()) return new Response(JSON.stringify({ error: 'Token expired' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });

    // mark as used
    const { error: updErr } = await supabaseAdmin
      .from('impersonations')
      .update({ used: true })
      .eq('id', row.id);

    if (updErr) console.error('Failed to mark impersonation used:', updErr);

    // fetch user profile to return
    const { data: userProfile, error: profErr } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', row.target_user_id)
      .maybeSingle();

    if (profErr) console.error('Error fetching user profile:', profErr);

    // audit log insert
    try {
      await supabaseAdmin.from('audit_log').insert({
        user_id: row.admin_id,
        action: 'impersonation_started',
        target_user_id: row.target_user_id,
        before_snapshot: null,
        after_snapshot: null,
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null
      });
    } catch (e) {
      console.error('Failed to write audit log:', e);
    }

    return new Response(JSON.stringify({ target_user_id: row.target_user_id, profile: userProfile || null }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
  } catch (error) {
    console.error('Unexpected error in consume-impersonation:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});
