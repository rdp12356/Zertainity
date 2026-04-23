import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  to: string;
  subject: string;
  html?: string;
  type: 'invite' | 'role_change' | 'deletion' | 'welcome' | 'suspended' | 'unsuspended' | 'password_reset';
  data?: Record<string, string>;
}

const baseStyles = `
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const headerStyles = `
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px 20px;
  text-align: center;
  border-radius: 12px 12px 0 0;
`;

const contentStyles = `
  background: #ffffff;
  padding: 30px;
  border: 1px solid #e0e0e0;
  border-top: none;
`;

const buttonStyles = `
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 14px 28px;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  margin: 20px 0;
`;

const footerStyles = `
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 12px;
  background: #f5f5f5;
  border-radius: 0 0 12px 12px;
  border: 1px solid #e0e0e0;
  border-top: none;
`;

function generateEmailTemplate(content: string, buttonText?: string, buttonUrl?: string, footerText?: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Zertainity</title>
    </head>
    <body style="margin: 0; padding: 20px; background: #f0f2f5;">
      <div style="${baseStyles}">
        <div style="${headerStyles}">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Zertainity</h1>
          <p style="margin: 10px 0 0; opacity: 0.9; font-size: 14px;">AI-Powered Career Guidance Platform</p>
        </div>
        <div style="${contentStyles}">
          ${content}
          ${buttonText && buttonUrl ? `<div style="text-align: center;"><a href="${buttonUrl}" style="${buttonStyles}">${buttonText}</a></div>` : ''}
        </div>
        <div style="${footerStyles}">
          ${footerText || '<p>© 2026 Zertainity. All rights reserved.</p>'}
          <p style="margin: 5px 0;"><a href="https://www.zertainity.in" style="color: #667eea;">www.zertainity.in</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getInviteEmail(data: { email: string; role: string }) {
  const content = `
    <h2 style="color: #333; margin-top: 0;">Welcome to Zertainity! 🎓</h2>
    <p>You've been invited to join <strong>Zertainity</strong>, an AI-powered career guidance platform.</p>
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Your Role:</strong> ${data.role}</p>
    </div>
    <p>Click the button below to set up your account and start exploring career pathways tailored just for you.</p>
  `;
  return generateEmailTemplate(content, 'Set Up My Account', 'https://www.zertainity.in/auth', '<p>If you did not expect this email, you can safely ignore it.</p>');
}

function getWelcomeEmail(data: { name?: string }) {
  const content = `
    <h2 style="color: #333; margin-top: 0;">You're All Set! ✅</h2>
    <p>Your Zertainity account has been created successfully.</p>
    <p>Here's what you can do:</p>
    <ul style="color: #555;">
      <li>📊 Take our career assessment quiz</li>
      <li>🎯 Discover careers matching your strengths</li>
      <li>🛤️ Get personalized pathway roadmaps</li>
      <li>📚 Explore schools and colleges</li>
    </ul>
  `;
  return generateEmailTemplate(content, 'Start Your Journey', 'https://www.zertainity.in', '<p>Need help? Reply to this email or contact support@zertainity.in</p>');
}

function getRoleChangeEmail(data: { oldRole: string; newRole: string }) {
  const content = `
    <h2 style="color: #333; margin-top: 0;">Your Role Has Been Updated 🔄</h2>
    <p>Your access level on Zertainity has been changed.</p>
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Previous Role:</strong> ${data.oldRole}</p>
      <p style="margin: 5px 0;"><strong>New Role:</strong> ${data.newRole}</p>
    </div>
    <p>If you have questions about this change, please contact your administrator.</p>
  `;
  return generateEmailTemplate(content, 'Visit Dashboard', 'https://www.zertainity.in/admin');
}

function getDeletionEmail(data: { email: string }) {
  const content = `
    <h2 style="color: #333; margin-top: 0;">Account Deleted 🗑️</h2>
    <p>Your Zertainity account has been permanently deleted.</p>
    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
      <p style="margin: 0; color: #856404;">This action cannot be undone. All your data has been removed from our systems.</p>
    </div>
    <p>If you believe this was a mistake, please contact support@zertainity.in.</p>
  `;
  return generateEmailTemplate(content, 'Visit Website', 'https://www.zertainity.in');
}

function getSuspendedEmail(data: { reason?: string }) {
  const content = `
    <h2 style="color: #333; margin-top: 0;">Account Suspended ⏸️</h2>
    <p>Your Zertainity account has been temporarily suspended.</p>
    ${data.reason ? `<div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;"><p style="margin: 0;"><strong>Reason:</strong> ${data.reason}</p></div>` : ''}
    <p>If you believe this was done in error, please contact support@zertainity.in to request reinstatement.</p>
  `;
  return generateEmailTemplate(content, 'Contact Support', 'mailto:support@zertainity.in');
}

function getUnsuspendedEmail() {
  const content = `
    <h2 style="color: #333; margin-top: 0;">Account Restored! ✅</h2>
    <p>Great news! Your Zertainity account has been reinstated and you can access the platform again.</p>
    <p>Welcome back! We missed you.</p>
  `;
  return generateEmailTemplate(content, 'Return to Zertainity', 'https://www.zertainity.in');
}

function getPasswordResetEmail(data: { resetUrl: string }) {
  const content = `
    <h2 style="color: #333; margin-top: 0;">Reset Your Password 🔑</h2>
    <p>We received a request to reset your Zertainity account password.</p>
    <p>Click the button below to create a new password. This link will expire in 24 hours.</p>
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
      <p style="margin: 0; color: #666; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;
  return generateEmailTemplate(content, 'Reset Password', data.resetUrl, '<p>⚠️ Never share this link with anyone. Zertainity will never ask for your password.</p>');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { to, subject, html, type, data }: NotificationRequest = await req.json();

    if (!to || !type) {
      throw new Error('Missing required fields: to, type');
    }

    let emailHtml = html;
    let emailSubject = subject;

    // Generate appropriate email template based on type
    switch (type) {
      case 'invite':
        emailHtml = getInviteEmail({ email: to, role: data?.role || 'user' });
        emailSubject = subject || 'You\'re Invited to Join Zertainity! 🎓';
        break;
      case 'welcome':
        emailHtml = getWelcomeEmail({ name: data?.name });
        emailSubject = subject || 'Welcome to Zertainity!';
        break;
      case 'role_change':
        emailHtml = getRoleChangeEmail({ oldRole: data?.oldRole || 'user', newRole: data?.newRole || 'user' });
        emailSubject = subject || 'Your Role Has Been Updated';
        break;
      case 'deletion':
        emailHtml = getDeletionEmail({ email: to });
        emailSubject = subject || 'Your Zertainity Account Has Been Deleted';
        break;
      case 'suspended':
        emailHtml = getSuspendedEmail({ reason: data?.reason });
        emailSubject = subject || 'Your Zertainity Account Has Been Suspended';
        break;
      case 'unsuspended':
        emailHtml = getUnsuspendedEmail();
        emailSubject = subject || 'Your Zertainity Account Has Been Restored';
        break;
      case 'password_reset':
        emailHtml = getPasswordResetEmail({ resetUrl: data?.resetUrl || '' });
        emailSubject = subject || 'Reset Your Zertainity Password';
        break;
    }

    // Use Supabase's built-in email service
    const { error } = await supabaseAdmin.auth.admin.sendEmail(to, {
      emailRedirectTo: 'https://www.zertainity.in/auth',
      subject: emailSubject,
      content: {
        html: emailHtml,
      },
    });

    if (error) {
      console.error('Error sending email:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send notification';
    console.error('Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});