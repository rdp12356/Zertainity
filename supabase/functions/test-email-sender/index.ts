import { Resend } from 'https://esm.sh/resend@4.0.0';
import { corsHeadersFor } from '../_shared/cors.ts';
import {
  buildInviteEmail,
  buildRoleChangeEmail,
  buildDeletionEmail,
  buildSuspensionEmail,
  buildWelcomeEmail,
  buildGenericEmail,
  getVerificationTemplate,
  getPasswordResetTemplate,
  getMagicLinkTemplate,
} from '../_shared/email-templates.ts';


Deno.serve(async (req) => {
  const corsHeaders = corsHeadersFor(req.headers.get("origin"));
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured in Supabase project secrets');
    }

    const resend = new Resend(resendApiKey);
    const to = 'johan.manoj@zertainity.in';

    const testTemplates = [
      {
        subject: 'Test [Invite]: You\'ve been invited to join Zertainity',
        html: buildInviteEmail('expert'),
      },
      {
        subject: 'Test [Role Update]: Your role has been updated',
        html: buildRoleChangeEmail('admin', 'system test runner'),
      },
      {
        subject: 'Test [Account Deletion]: Your account has been removed',
        html: buildDeletionEmail(),
      },
      {
        subject: 'Test [Suspension]: Your account has been suspended',
        html: buildSuspensionEmail('Violating community guidelines (Demo Test)'),
      },
      {
        subject: 'Test [Welcome]: Welcome to Zertainity!',
        html: buildWelcomeEmail(),
      },
      {
        subject: 'Test [Generic]: System Status Update',
        html: buildGenericEmail(
          'System Status Update',
          'This is a generic system notification to verify the typography and button pill style of standard emails.',
          'Open Dashboard',
          'https://zertainity.in'
        ),
      },
      {
        subject: 'Test [Auth - Confirm Signup]: Verify your email — Zertainity',
        html: getVerificationTemplate().replace('{{ .ConfirmationURL }}', 'https://zertainity.in/verify?token=test'),
      },
      {
        subject: 'Test [Auth - Reset Password]: Reset your password — Zertainity',
        html: getPasswordResetTemplate().replace('{{ .ConfirmationURL }}', 'https://zertainity.in/reset?token=test'),
      },
      {
        subject: 'Test [Auth - Magic Link]: Your login link — Zertainity',
        html: getMagicLinkTemplate().replace('{{ .ConfirmationURL }}', 'https://zertainity.in/login?token=test'),
      },
    ];

    const results = [];
    for (const t of testTemplates) {
      console.log(`Sending: ${t.subject}`);
      const res = await resend.emails.send({
        from: 'Zertainity <noreply@zertainity.in>',
        to: [to],
        subject: t.subject,
        html: t.html,
      });
      results.push({ subject: t.subject, result: res });
    }

    return new Response(
      JSON.stringify({ success: true, sentCount: testTemplates.length, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error('Error running email tests:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
