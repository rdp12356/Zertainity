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
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Use service role client to verify the JWT and check admin/owner status
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Authentication failed:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Check if user is admin or owner
    const { data: userRoles, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'owner']);

    if (roleError || !userRoles || userRoles.length === 0) {
      console.error('Admin/Owner check failed:', roleError);
      return new Response(
        JSON.stringify({ error: 'Admin or Owner access required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Get email and role from request body
    const { email, role = 'user' } = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Validate role
    const validRoles = ['user', 'editor', 'manager', 'admin', 'owner'];
    if (!validRoles.includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Invalid role' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Admin/Owner inviting user:', email, 'with role:', role);

    // Get the redirect URL from environment
    const redirectTo = `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovableproject.com') || ''}/auth`;

    // Invite user using admin client
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        redirectTo: redirectTo,
      }
    );

    if (inviteError) {
      console.error('Error inviting user:', inviteError);
      return new Response(
        JSON.stringify({ error: inviteError.message || 'Failed to invite user' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Assign role to the invited user if it's not 'user'
    if (role !== 'user' && inviteData.user) {
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: inviteData.user.id, role: role });

      if (roleError) {
        console.error('Error assigning role:', roleError);
        // Don't fail the invitation, just log the error
      }
    }

    // Log audit trail
    const { error: auditError } = await supabaseAdmin
      .from('audit_log')
      .insert({
        user_id: user.id,
        target_user_id: inviteData.user?.id,
        action: 'user_invited',
        after_snapshot: {
          email,
          role,
          invited_at: new Date().toISOString(),
        },
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        user_agent: req.headers.get('user-agent'),
      });

    if (auditError) {
      console.error('Error logging audit trail:', auditError);
    }

    // Send notification email
    try {
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify({
          to: email,
          subject: 'You have been invited to Zertainity',
          html: `
            <h1>Welcome to Zertainity!</h1>
            <p>You have been invited to join our platform with the role of <strong>${role}</strong>.</p>
            <p>Please check your email for the invitation link to set up your account.</p>
            <p>Best regards,<br>The Zertainity Team</p>
          `,
          type: 'invite',
        }),
      });
    } catch (notifError) {
      console.error('Error sending notification:', notifError);
      // Don't fail the invitation if notification fails
    }

    console.log('User invited successfully:', email, 'with role:', role);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invitation sent successfully',
        user: inviteData.user
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
