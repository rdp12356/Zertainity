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
  subject: string;
  // Raw HTML is never accepted from API callers; use the audited template types.
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
      throw new Error('Use Supabase Auth invite for activation links');
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
      throw new Error('Unsupported notification template');
  }
}

Deno.serve(async (req) => {
  const corsHeaders = corsHeadersFor(req.headers.get("origin"));
  // Handle CORS preflight requests
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
      console.log('RESEND_API_KEY not configured - skipping email notification');
      return new Response(
        JSON.stringify({ error: 'Email delivery is not configured' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 503,
        }
      );
    }

    const resend = new Resend(resendApiKey);
    const { to, subject, type, data }: NotificationRequest = await req.json();

    const recipient = typeof to === 'string' ? to.trim().toLowerCase() : '';
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(recipient) || recipient.length > 254 ||
        typeof subject !== 'string' || subject.length > 160 || subject.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Valid recipient and subject are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (type === 'invite') {
      return new Response(JSON.stringify({ error: 'Invitation email requires Supabase Auth activation link' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const emailHtml = buildHtmlFromType(type, data);
    if (emailHtml.length > 40_000) {
      return new Response(JSON.stringify({ error: 'Notification body too large' }), {
        status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Sending ${type} notification`);

    const emailResponse = await resend.emails.send({
      from: 'Zertainity <noreply@zertainity.in>',
      to: [recipient],
      subject,
      html: emailHtml,
    });

    if (emailResponse.error || !emailResponse.data?.id) {
      console.error('Resend rejected notification:', emailResponse.error);
      return new Response(JSON.stringify({ error: 'Email provider rejected notification' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log('Notification accepted by email provider');

    return new Response(
      JSON.stringify({ success: true, messageId: emailResponse.data.id }),
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