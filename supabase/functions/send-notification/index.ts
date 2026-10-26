import { Resend } from 'https://esm.sh/resend@4.0.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeadersFor } from '../_shared/cors.ts';
import {
  buildInviteEmail,
  buildRoleChangeEmail,
  buildDeletionEmail,
  buildSuspensionEmail,
  buildWelcomeEmail,
  buildGenericEmail,
} from '../_shared/email-templates.ts';


interface NotificationRequest {
  to: string;
  subject?: string;       // Only used for custom generic notices; standard mail has controlled subjects
  type: 'invite' | 'role_change' | 'deletion' | 'suspension' | 'welcome' | 'generic';
  data?: {
    role?: string;
    newRole?: string;
    reason?: string;
    changedBy?: string;
    title?: string;
    message?: string;
    ctaText?: string;
    ctaUrl?: string;
  };
}

function buildHtmlFromType(type: string, data: NotificationRequest['data']): string {
  switch (type) {
    case 'invite':
      return buildInviteEmail(data?.role ?? 'user');
    case 'role_change':
      return buildRoleChangeEmail(data?.newRole ?? 'user', data?.changedBy);
    case 'deletion':
      return buildDeletionEmail();
    case 'suspension':
      return buildSuspensionEmail(data?.reason);
    case 'welcome':
      return buildWelcomeEmail();
    case 'generic':
      return buildGenericEmail(
        data?.title ?? 'Notification',
        data?.message ?? '',
        data?.ctaText,
        data?.ctaUrl,
      );
    default:
      return buildGenericEmail('Notification', 'You have a new notification from Zertainity.');
  }
}

const NOTIFICATION_SUBJECTS: Record<Exclude<NotificationRequest['type'], 'generic'>, string> = {
  invite: "Your Zertainity invitation",
  role_change: "Your Zertainity access was updated",
  deletion: "Important update about your Zertainity account",
  suspension: "Your Zertainity account has been suspended",
  welcome: "Welcome to Zertainity",
};

Deno.serve(async (req) => {
  const corsHeaders = corsHeadersFor(req.headers.get("origin"));
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

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

    if (!authHeader.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Invalid authorization header' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 });
    const token = authHeader.slice(7);
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const { data: userRoles, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .in('role', ['admin', 'owner']);

    if (roleError || !userRoles || userRoles.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Admin or Owner access required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is missing; email was not sent');
      return new Response(
        JSON.stringify({ success: false, error: 'Email sending is not configured' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 503,
        }
      );
    }

    const resend = new Resend(resendApiKey);
    const input: NotificationRequest = await req.json();
    const { to, type, data } = input;
    if (!to || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(to) || to.length > 254) {
      return new Response(JSON.stringify({ error: 'Valid recipient email required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (type !== 'generic' && !Object.prototype.hasOwnProperty.call(NOTIFICATION_SUBJECTS, type)) {
      return new Response(JSON.stringify({ error: 'Invalid notification type' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    // All outgoing HTML is assembled from vetted templates, never caller-provided HTML.
    const emailHtml = buildHtmlFromType(type, data);
    const subject = type === 'generic'
      ? (typeof input.subject === 'string' ? input.subject.slice(0, 120) : 'A message from Zertainity')
      : NOTIFICATION_SUBJECTS[type];
    const emailResponse = await resend.emails.send({
      from: 'Zertainity <noreply@zertainity.in>',
      to: [to],
      subject,
      html: emailHtml,
    });
    if (emailResponse.error || !emailResponse.data?.id) {
      console.error('Resend declined transactional email:', emailResponse.error);
      return new Response(JSON.stringify({ success: false, error: 'Email provider did not accept the message' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ success: true, id: emailResponse.data.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error sending notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});