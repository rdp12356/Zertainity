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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Checking if any admin exists...')
    
    // Check if any admin already exists
    const { data: existingAdmins, error: checkError } = await supabaseClient
      .from('user_roles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)

    if (checkError) {
      console.error('Error checking for existing admins:', checkError)
      return new Response(
        JSON.stringify({ error: 'Failed to check existing admins' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    if (existingAdmins && existingAdmins.length > 0) {
      console.log('Admin already exists, setup not allowed')
      return new Response(
        JSON.stringify({ error: 'An admin user already exists. Setup is only allowed once.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    console.log('No admin exists, creating first admin for user:', userId)

    // Create the first admin
    const { error: insertError } = await supabaseClient
      .from('user_roles')
      .insert({ user_id: userId, role: 'admin' })

    if (insertError) {
      console.error('Error creating admin:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create admin user' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('First admin created successfully')

    return new Response(
      JSON.stringify({ success: true, message: 'First admin user created successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
