// Deno Edge Function: on-user-signup
// Triggered by Supabase Auth Hook (after user confirms their email)
// =============================================================================
// This function is called by Supabase whenever a new user signs up.
// It sends a welcome email via send-career-email and logs the event.
//
// Setup in Supabase:
//   Dashboard → Authentication → Hooks → "Send Email Hook"
//   Set to: https://<project-ref>.supabase.co/functions/v1/on-user-signup
// =============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );

        // Supabase Auth Hooks send the event payload in the request body
        const payload = await req.json();

        // The hook payload shape: { type, event, user: { id, email, ... } }
        const user = payload?.user ?? payload?.record;

        if (!user?.email) {
            console.warn('on-user-signup: no user email in payload', JSON.stringify(payload));
            return new Response(JSON.stringify({ skipped: true }), {
                status: 200,
                headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            });
        }

        const userId = user.id;
        const email = user.email;
        const name =
            user.raw_user_meta_data?.full_name ??
            user.raw_user_meta_data?.name ??
            email.split('@')[0];

        console.log(`on-user-signup: sending welcome email to ${email}`);

        // Check if welcome email was already sent (idempotency)
        const { data: existing } = await supabase
            .from('email_logs')
            .select('id')
            .eq('user_id', userId)
            .eq('email_type', 'welcome')
            .single();

        if (existing) {
            console.log('on-user-signup: welcome email already sent, skipping');
            return new Response(JSON.stringify({ skipped: true, reason: 'already_sent' }), {
                status: 200,
                headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            });
        }

        // Call send-career-email to deliver the welcome email
        const emailRes = await supabase.functions.invoke('send-career-email', {
            body: {
                userId,
                toEmail: email,
                name,
                emailType: 'welcome',
            },
        });

        console.log('on-user-signup: email result', JSON.stringify(emailRes.data));

        return new Response(
            JSON.stringify({ success: true, email, result: emailRes.data }),
            { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );

    } catch (err) {
        console.error('on-user-signup error:', err);
        // Return 200 so Supabase doesn't retry infinitely
        return new Response(
            JSON.stringify({ error: (err as Error).message }),
            { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
    }
});
