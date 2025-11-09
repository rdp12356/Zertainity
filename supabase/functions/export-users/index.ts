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
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    console.log('Exporting users...');

    // Get all users with their data
    const { data: usersData, error: usersError } = await supabaseAdmin.rpc('get_all_users_with_roles');

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch users' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Get profiles
    const { data: profiles } = await supabaseAdmin
      .from('user_profiles')
      .select('*');

    // Get suspended users
    const { data: suspendedUsers } = await supabaseAdmin
      .from('suspended_users')
      .select('user_id');

    const suspendedUserIds = new Set(suspendedUsers?.map(s => s.user_id) || []);
    const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);

    // Create CSV content
    const csvRows = [
      ['Email', 'User ID', 'Roles', 'Status', 'Created At', 'Last Sign In', 'Phone', 'Date of Birth', 'Location'].join(',')
    ];

    usersData.forEach((user: any) => {
      const profile = profilesMap.get(user.id);
      const status = suspendedUserIds.has(user.id) ? 'Suspended' : 'Active';
      const roles = Array.isArray(user.roles) ? user.roles.join(';') : '';
      
      csvRows.push([
        user.email || '',
        user.id || '',
        roles,
        status,
        user.created_at || '',
        user.last_sign_in_at || '',
        profile?.phone_number || '',
        profile?.date_of_birth || '',
        profile?.location || ''
      ].map(field => `"${field}"`).join(','));
    });

    const csvContent = csvRows.join('\n');

    return new Response(
      csvContent,
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="users-export-${new Date().toISOString()}.csv"`
        }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
