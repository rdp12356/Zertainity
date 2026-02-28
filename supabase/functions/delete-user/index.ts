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
      throw new Error('Only owners can delete users');
    }

    // Get the request body
    const { userId } = await req.json();

    console.log('Delete user request:', { userId, requestorId: user.id });

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Prevent users from deleting themselves
    if (userId === user.id) {
      throw new Error('You cannot delete your own account');
    }

    // Check if the user being deleted is an owner
    const { data: targetUserRoles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'owner');

    if (targetUserRoles && targetUserRoles.length > 0) {
      throw new Error('Cannot delete another owner account');
    }

    console.log('Attempting to delete user:', userId);

    // Get user details before deletion for audit log
    const { data: targetUser } = await supabaseAdmin.auth.admin.getUserById(userId);
    const { data: targetRoles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    // Log audit trail before deletion
    const { error: auditError } = await supabaseAdmin
      .from('audit_log')
      .insert({
        user_id: user.id,
        target_user_id: userId,
        action: 'user_deleted',
        before_snapshot: {
          email: targetUser?.user?.email,
          roles: targetRoles?.map(r => r.role) || [],
          deleted_at: new Date().toISOString(),
        },
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        user_agent: req.headers.get('user-agent'),
      });

    if (auditError) {
      console.error('Error logging audit trail:', auditError);
    }

    // Send notification email before deletion
    if (targetUser?.user?.email) {
      try {
        await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
          body: JSON.stringify({
            to: targetUser.user.email,
            subject: 'Account Deletion Notice',
            html: `
              <h1>Account Deletion Notice</h1>
              <p>Your account on Zertainity has been deleted by an administrator.</p>
              <p>If you believe this was done in error, please contact support.</p>
              <p>Best regards,<br>The Zertainity Team</p>
            `,
            type: 'deletion',
          }),
        });
      } catch (notifError) {
        console.error('Error sending notification:', notifError);
        // Don't fail the deletion if notification fails
      }
    }

    // Delete the user using admin API
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      throw deleteError;
    }

    console.log('User deleted successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'User deleted successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in delete-user function:', error);
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
