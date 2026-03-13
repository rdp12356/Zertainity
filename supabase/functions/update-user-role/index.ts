import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Verify the user is authenticated and get their info
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      throw new Error('Unauthorized');
    }

    // Check if the requesting user is an owner
    const { data: requestorRoles, error: roleCheckError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'owner');

    if (roleCheckError || !requestorRoles || requestorRoles.length === 0) {
      console.error('Permission denied: User is not an owner');
      throw new Error('Only owners can update user roles');
    }

    // Get the request body
    const { userId, newRole, oldRole } = await req.json();

    console.log('Update role request:', { userId, oldRole, newRole, requestorId: user.id });

    if (!userId || !newRole) {
      throw new Error('User ID and new role are required');
    }

    // Validate the role
    const validRoles = ['user', 'editor', 'manager', 'admin', 'owner'];
    if (!validRoles.includes(newRole) || (oldRole && !validRoles.includes(oldRole))) {
      throw new Error('Invalid role specified');
    }

    // Prevent users from demoting themselves
    if (userId === user.id) {
      throw new Error('You cannot change your own role');
    }

    // Get target user email for notification
    const { data: targetUser } = await supabaseAdmin.auth.admin.getUserById(userId);

    // Handle role update
    if (oldRole) {
      // Delete the old role if it exists
      const { error: deleteError } = await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', oldRole);

      if (deleteError) {
        console.error('Error deleting old role:', deleteError);
        throw deleteError;
      }
    }

    // Insert the new role (unless it's 'user' which means no special role)
    if (newRole !== 'user') {
      const { error: insertError } = await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: userId, role: newRole });

      if (insertError) {
        console.error('Error inserting new role:', insertError);
        throw insertError;
      }
    }

    // Log audit trail
    const { error: auditError } = await supabaseAdmin
      .from('audit_log')
      .insert({
        user_id: user.id,
        target_user_id: userId,
        action: 'role_changed',
        before_snapshot: oldRole ? { role: oldRole } : null,
        after_snapshot: { role: newRole },
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        user_agent: req.headers.get('user-agent'),
      });

    if (auditError) {
      console.error('Error logging audit trail:', auditError);
    }

    // Send notification email
    if (targetUser?.user?.email) {
      try {
        await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': req.headers.get('Authorization') || '',
          },
          body: JSON.stringify({
            to: targetUser.user.email,
            subject: 'Your role has been updated',
            html: `
              <h1>Role Update Notification</h1>
              <p>Your role on Zertainity has been updated.</p>
              <p>Previous role: <strong>${oldRole || 'user'}</strong></p>
              <p>New role: <strong>${newRole}</strong></p>
              <p>Best regards,<br>The Zertainity Team</p>
            `,
            type: 'role_change',
          }),
        });
      } catch (notifError) {
        console.error('Error sending notification:', notifError);
        // Don't fail the role update if notification fails
      }
    }

    console.log('Role updated successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Role updated successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in update-user-role function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
