import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeadersFor } from '../_shared/cors.ts';


Deno.serve(async (req) => {
  const corsHeaders = corsHeadersFor(req.headers.get("origin"));
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
      return new Response(JSON.stringify({ error: 'Only admins and owners can resend invites' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 });
    }

    const { email } = await req.json();
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Resend invite by calling Supabase admin invite endpoint
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(normalizedEmail, { redirectTo: 'https://zertainity.in/auth' });

    if (inviteError) {
      console.error('Error resending invite:', inviteError);
      return new Response(JSON.stringify({ error: inviteError.message || 'Failed to resend invite' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
    }

    // Log audit
    try {
      await supabaseAdmin.from('audit_log').insert({
        user_id: user.id,
        target_user_id: inviteData.user?.id,
        action: 'invite_resent',
        after_snapshot: { email: normalizedEmail, resent_at: new Date().toISOString() },
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        user_agent: req.headers.get('user-agent'),
      });
    } catch (e) {
      console.warn('Failed to write audit for resend:', e);
    }

    // Try to send notification but do not fail on errors
    try {
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
        body: JSON.stringify({ to: normalizedEmail, subject: `Resent: You've been invited to Zertainity`, type: 'invite', data: {} }),
      });
    } catch (e) {
      console.warn('Notification send failed for resend:', e);
    }

    return new Response(JSON.stringify({ success: true, message: 'Invitation resent' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
  } catch (error) {
    console.error('Unexpected error in resend-invite:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});
