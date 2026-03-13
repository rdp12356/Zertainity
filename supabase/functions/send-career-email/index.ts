// @ts-nocheck
// Deno Edge Function: send-career-email
// Route: POST /functions/v1/send-career-email
// =============================================================================
// Sends automated emails via Resend API.
// Called internally by career-analysis (fire & forget) or directly by frontend.
//
// Email types:
//   welcome        – sent on first signup
//   career_result  – career analysis result summary
//   roadmap        – detailed pathway email
//   followup_d3    – day 3 follow-up (triggered by cron)
//   followup_d7    – day 7 follow-up (triggered by cron)
// =============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FROM_ADDRESS = 'Zertainity <noreply@zertainity.in>';
const RESEND_API = 'https://api.resend.com/emails';

// ─── Email HTML templates ─────────────────────────────────────────────────────

function welcomeTemplate(name: string): { subject: string; html: string } {
  return {
    subject: 'Welcome to Zertainity 🎯',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f8f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#0a0a0a;padding:40px 32px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px;">Zertainity</h1>
      <p style="color:#888;margin:8px 0 0;font-size:13px;text-transform:uppercase;letter-spacing:2px;">AI Career Mentorship Platform</p>
    </div>
    <div style="padding:40px 32px;">
      <h2 style="color:#0a0a0a;font-size:22px;font-weight:600;margin:0 0 16px;">Welcome, ${name || 'Future Leader'}! 🎯</h2>
      <p style="color:#444;line-height:1.7;margin:0 0 16px;">You've just joined India's most advanced AI-powered career mentorship platform. We combine data-driven analysis with mentor-style AI guidance to give you <strong>real career clarity</strong>.</p>
      <p style="color:#444;line-height:1.7;margin:0 0 24px;">Your personalised career analysis will explore your academic strengths, interest profile, and personality to match you with careers where you're most likely to thrive.</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="https://zertainity.in/education-level" style="background:#0a0a0a;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;display:inline-block;">Start Your Career Analysis →</a>
      </div>
      <div style="background:#f4f4f4;border-radius:8px;padding:20px;margin-top:24px;">
        <p style="color:#666;font-size:13px;margin:0;line-height:1.6;"><strong>What happens next?</strong><br>1. Select your education level<br>2. Enter your subject marks<br>3. Complete the interest quiz (5 min)<br>4. Get your personalised career report</p>
      </div>
    </div>
    <div style="border-top:1px solid #f0f0f0;padding:24px 32px;text-align:center;">
      <p style="color:#999;font-size:12px;margin:0;">Questions? Email us at <a href="mailto:support@zertainity.in" style="color:#0a0a0a;">support@zertainity.in</a></p>
      <p style="color:#bbb;font-size:11px;margin:8px 0 0;">© 2026 Zertainity · India's AI Career Mentorship Platform</p>
    </div>
  </div>
</body>
</html>`,
  };
}

function careerResultTemplate(
  name: string,
  topCareer: string,
  matchScore: number,
  resultUrl: string
): { subject: string; html: string } {
  const scoreColour = matchScore >= 75 ? '#16a34a' : matchScore >= 55 ? '#d97706' : '#dc2626';
  return {
    subject: `Your Career Analysis is Ready — ${topCareer} (${matchScore}% match)`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f8f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#0a0a0a;padding:40px 32px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px;">Zertainity</h1>
      <p style="color:#888;margin:8px 0 0;font-size:13px;text-transform:uppercase;letter-spacing:2px;">Your Career Report Is Ready</p>
    </div>
    <div style="padding:40px 32px;">
      <h2 style="color:#0a0a0a;font-size:22px;font-weight:600;margin:0 0 8px;">Hi ${name || 'there'}, great work completing your analysis! 🎉</h2>
      <p style="color:#666;margin:0 0 28px;">Here's a summary of your personalised career match report:</p>

      <div style="background:#f9f9f9;border:1px solid #eee;border-radius:10px;padding:24px;margin-bottom:24px;text-align:center;">
        <p style="color:#666;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 8px;">Top Career Match</p>
        <h3 style="color:#0a0a0a;font-size:26px;font-weight:700;margin:0 0 12px;">${topCareer}</h3>
        <div style="display:inline-block;background:${scoreColour};color:#fff;font-size:20px;font-weight:700;padding:8px 20px;border-radius:20px;">${matchScore}% Match</div>
      </div>

      <p style="color:#444;line-height:1.7;margin:0 0 24px;">Your full report includes your complete top 3 career matches, a personalised AI mentor explanation, entrance exam guidance, and a 5-year growth roadmap.</p>

      <div style="text-align:center;margin:24px 0;">
        <a href="${resultUrl}" style="background:#0a0a0a;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;display:inline-block;">View Full Report →</a>
      </div>
    </div>
    <div style="border-top:1px solid #f0f0f0;padding:24px 32px;text-align:center;">
      <p style="color:#999;font-size:12px;margin:0;">Need help? <a href="mailto:support@zertainity.in" style="color:#0a0a0a;">support@zertainity.in</a></p>
      <p style="color:#bbb;font-size:11px;margin:8px 0 0;">© 2026 Zertainity · India's AI Career Mentorship Platform</p>
    </div>
  </div>
</body>
</html>`,
  };
}

function followupTemplate(
  name: string,
  day: 3 | 7,
  topCareer: string
): { subject: string; html: string } {
  const dayContent = day === 3 ? {
    headline: `Still thinking about ${topCareer}?`,
    body: `We noticed you completed your career analysis a few days ago. Many students find it helpful to revisit their roadmap and start planning their exam preparation early.`,
    cta: 'Review Your Career Roadmap',
  } : {
    headline: `Your next step toward ${topCareer}`,
    body: `A week ago you received your career analysis. The best time to start exam preparation is now. We've curated a learning path specifically for your career match.`,
    cta: 'Explore Your Learning Path',
  };
  return {
    subject: `${dayContent.headline} | Zertainity`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8f8f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#0a0a0a;padding:32px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">Zertainity</h1>
    </div>
    <div style="padding:36px 32px;">
      <h2 style="color:#0a0a0a;font-size:20px;margin:0 0 16px;">${dayContent.headline}</h2>
      <p style="color:#555;line-height:1.7;margin:0 0 24px;">${dayContent.body}</p>
      <div style="text-align:center;">
        <a href="https://zertainity.in/results" style="background:#0a0a0a;color:#fff;padding:13px 28px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">${dayContent.cta} →</a>
      </div>
    </div>
    <div style="border-top:1px solid #f0f0f0;padding:20px 32px;text-align:center;">
      <p style="color:#bbb;font-size:11px;margin:0;">© 2026 Zertainity · <a href="mailto:support@zertainity.in" style="color:#999;text-decoration:none;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`,
  };
}

// ─── Main handler ─────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    const body = await req.json();
    const {
      userId,
      resultId,
      emailType,
      toEmail: overrideEmail,
      topCareer = 'your top career',
      matchScore = 0,
      name: overrideName,
    } = body;

    // Look up user email and name
    let toEmail = overrideEmail;
    let name = overrideName ?? '';

    if (userId && !toEmail) {
      const { data: { user } } = await supabase.auth.admin.getUserById(userId);
      toEmail = user?.email ?? '';
      name = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? toEmail.split('@')[0];
    }

    if (!toEmail) {
      return new Response(JSON.stringify({ error: 'No email address' }), { status: 400, headers: CORS_HEADERS });
    }

    // Build email content
    let emailContent: { subject: string; html: string };
    const resultUrl = `https://zertainity.in/results?r=${resultId ?? ''}`;

    switch (emailType) {
      case 'welcome':
        emailContent = welcomeTemplate(name);
        break;
      case 'career_result':
        emailContent = careerResultTemplate(name, topCareer, matchScore, resultUrl);
        break;
      case 'roadmap':
        emailContent = careerResultTemplate(name, topCareer, matchScore, resultUrl);
        break;
      case 'followup_d3':
        emailContent = followupTemplate(name, 3, topCareer);
        break;
      case 'followup_d7':
        emailContent = followupTemplate(name, 7, topCareer);
        break;
      default:
        return new Response(JSON.stringify({ error: 'Unknown emailType' }), { status: 400, headers: CORS_HEADERS });
    }

    // Send via Resend
    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (!resendKey) {
      // Resend not configured yet — log and skip gracefully.
      // Career analysis still works; emails are just queued for later.
      console.warn('send-career-email: RESEND_API_KEY not set, skipping email send.');
      return new Response(
        JSON.stringify({ skipped: true, reason: 'RESEND_API_KEY not configured' }),
        { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const resendRes = await fetch(RESEND_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [toEmail],
        subject: emailContent.subject,
        html: emailContent.html,
      }),
    });

    const resendData = await resendRes.json();
    const resendId = resendData?.id ?? null;
    const status = resendRes.ok ? 'sent' : 'failed';

    // Log to email_logs
    await supabase.from('email_logs').insert({
      user_id: userId ?? null,
      email_type: emailType,
      to_email: toEmail,
      resend_id: resendId,
      status,
    });

    // Mark email_sent on career_results
    if (resultId && emailType === 'career_result') {
      await supabase.from('career_results').update({ email_sent: true }).eq('id', resultId);
    }

    return new Response(
      JSON.stringify({ success: resendRes.ok, resendId, status }),
      { status: resendRes.ok ? 200 : 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('send-career-email error:', err);
    return new Response(
      JSON.stringify({ error: 'Email send failed', details: (err as Error).message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
});
