import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
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

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { data: requestorRoles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'owner']);

    if (!requestorRoles || requestorRoles.length === 0) {
      throw new Error('Admin or Owner access required');
    }

    const isOwner = requestorRoles.some(r => r.role === 'owner');

    const { userId } = await req.json();

    if (!userId) {
      throw new Error('User ID is required');
    }

    if (userId === user.id) {
      throw new Error('You cannot delete your own account');
    }

    const { data: targetUserRoles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'owner');

    if (targetUserRoles && targetUserRoles.length > 0) {
      throw new Error('Cannot delete another owner account');
    }

    if (!isOwner) {
      const { data: targetAdminRoles } = await supabaseAdmin
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (targetAdminRoles && targetAdminRoles.length > 0) {
        throw new Error('Only owners can delete admin accounts');
      }
    }

    const { data: targetUser } = await supabaseAdmin.auth.admin.getUserById(userId);
    const { data: targetRoles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    await supabaseAdmin
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

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      throw deleteError;
    }

    return new Response(
      JSON.stringify({ success: true, message: 'User deleted successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
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