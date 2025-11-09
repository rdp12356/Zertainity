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

    const { userId, reason } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Suspending user ${userId} by ${user.id}`);

    // Check if user is already suspended
    const { data: existingSuspension } = await supabaseAdmin
      .from('suspended_users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (existingSuspension) {
      return new Response(
        JSON.stringify({ error: 'User is already suspended' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Insert suspension record
    const { error: suspendError } = await supabaseAdmin
      .from('suspended_users')
      .insert({
        user_id: userId,
        suspended_by: user.id,
        reason: reason || 'No reason provided'
      });

    if (suspendError) {
      console.error('Error suspending user:', suspendError);
      return new Response(
        JSON.stringify({ error: 'Failed to suspend user' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Log to audit trail
    await supabaseAdmin.from('audit_log').insert({
      user_id: user.id,
      target_user_id: userId,
      action: 'suspend_user',
      after_snapshot: { suspended: true, reason: reason || 'No reason provided' }
    });

    console.log('User suspended successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'User suspended successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
