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

    const { userId, newRole, oldRole } = await req.json();

    if (!userId || !newRole) {
      throw new Error('User ID and new role are required');
    }

    const validRoles = ['user', 'editor', 'manager', 'admin'];
    if (!validRoles.includes(newRole)) {
      throw new Error('Invalid role specified');
    }

    if (userId === user.id) {
      throw new Error('You cannot change your own role');
    }

    if (newRole === 'owner' && !isOwner) {
      throw new Error('Only owners can assign owner role');
    }

    const { data: targetUser } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (oldRole) {
      await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', oldRole);
    }

    if (newRole !== 'user') {
      await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: userId, role: newRole });
    }

    await supabaseAdmin
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

    return new Response(
      JSON.stringify({ success: true, message: 'Role updated successfully' }),
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