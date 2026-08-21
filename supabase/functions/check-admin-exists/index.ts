import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeadersFor } from '../_shared/cors.ts';


Deno.serve(async (req) => {
  const corsHeaders = corsHeadersFor(req.headers.get("origin"));
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Check if any admin or owner exists (using service role to bypass RLS)
    const { data: existingAdmins, error } = await supabaseAdmin
      .from('user_roles')
      .select('id')
      .in('role', ['admin', 'owner'])
      .limit(1);

    if (error) {
      console.error('Error checking for admins:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to check admin status' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const adminExists = existingAdmins && existingAdmins.length > 0;
    
    return new Response(
      JSON.stringify({ adminExists }),
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
