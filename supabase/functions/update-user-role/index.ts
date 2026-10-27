import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';
import { corsHeadersFor } from '../_shared/cors.ts';


Deno.serve(async (req) => {
  const corsHeaders = corsHeadersFor(req.headers.get("origin"));
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
    
    if (authError || !user || !user.email_confirmed_at) {
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

    // Never log student IDs or account-change request payloads.

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

    // Database changes and audit record are committed atomically.
    // Only service_role can call this RPC; the function also rechecks the owner's role.
    const { data: roleUpdated, error: changeError } = await supabaseAdmin.rpc('owner_replace_user_role', {
      p_actor_user_id: user.id,
      p_target_user_id: userId,
      p_previous_role: oldRole || null,
      p_next_role: newRole,
    });
    if (changeError || roleUpdated !== true) {
      console.error('Atomic role update failed', changeError);
      throw new Error('Unable to update role; refresh account roles and retry');
    }

    // A failed email is reported separately and never undoes a committed role change.
    let notificationSent = false;
    // Send notification email
    if (targetUser?.user?.email) {
      try {
        const notificationResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': req.headers.get('Authorization') || '',
          },
          body: JSON.stringify({
            to: targetUser.user.email,
            type: 'role_change',
            data: { newRole: String(newRole), changedBy: 'a Zertainity administrator' },
          }),
        });
        notificationSent = notificationResponse.ok;
        if (!notificationSent) console.error('Role update notification failed:', notificationResponse.status);
      } catch (notifError) {
        console.error('Error sending notification:', notifError);
        // Don't fail the role update if notification fails
      }
    }

    console.log('Role updated successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Role updated successfully', notificationSent }),
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
