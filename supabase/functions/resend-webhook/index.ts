// Deno Edge Function: resend-webhook
// Route: POST /functions/v1/resend-webhook
// =============================================================================
// Receives delivery status callbacks from Resend.
// Updates email_logs status and logs raw payload to resend_webhook_logs.
//
// Setup in Resend Dashboard:
//   Webhooks → Add endpoint:
//   https://<project-ref>.supabase.co/functions/v1/resend-webhook
//   Events: email.sent, email.delivered, email.bounced, email.complained
// =============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req: Request) => {
    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );

        const payload = await req.json();

        // Resend webhook payload shape:
        // { type: "email.delivered", data: { email_id: "...", to: ["email"], ... } }
        const eventType = payload?.type ?? 'unknown';
        const resendId = payload?.data?.email_id ?? null;
        const toEmail = payload?.data?.to?.[0] ?? null;

        // Map Resend event type → our status
        const STATUS_MAP: Record<string, string> = {
            'email.sent': 'sent',
            'email.delivered': 'delivered',
            'email.bounced': 'bounced',
            'email.complained': 'bounced',
            'email.opened': 'delivered',
        };
        const newStatus = STATUS_MAP[eventType] ?? 'sent';

        // 1. Log the raw webhook
        await supabase.from('resend_webhook_logs').insert({
            resend_id: resendId,
            event_type: eventType,
            to_email: toEmail,
            payload: payload,
        });

        // 2. Update email_logs if we have the resend_id
        if (resendId) {
            await supabase
                .from('email_logs')
                .update({ status: newStatus })
                .eq('resend_id', resendId);
        }

        return new Response(JSON.stringify({ ok: true, eventType, newStatus }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (err) {
        console.error('resend-webhook error:', err);
        // Always return 200 to prevent Resend from retrying
        return new Response(JSON.stringify({ ok: false, error: (err as Error).message }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
});
