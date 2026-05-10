import { Resend } from 'https://esm.sh/resend@4.0.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import {
  buildInviteEmail,
  buildRoleChangeEmail,
  buildDeletionEmail,
  buildSuspensionEmail,
  buildWelcomeEmail,
  buildGenericEmail,
} from '../_shared/email-templates.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  to: string;
  subject: string;
  html?: string;          // Optional — if omitted, generated from type + data
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

Deno.serve(async (req) => {
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
        JSON.stringify({ success: true, message: 'Email notification skipped - API key not configured' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    const resend = new Resend(resendApiKey);
    const { to, subject, html, type, data }: NotificationRequest = await req.json();

    if (!to || !subject) {
      throw new Error('Missing required fields: to, subject');
    }

    // Use provided HTML if given, otherwise generate from template
    const emailHtml = html || buildHtmlFromType(type, data);

    console.log(`Sending ${type} notification to ${to}`);

    const emailResponse = await resend.emails.send({
      from: 'Zertainity <noreply@zertainity.in>',
      to: [to],
      subject,
      html: emailHtml,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
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