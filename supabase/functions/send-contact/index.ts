import { Resend } from 'https://esm.sh/resend@4.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const OWNER_EMAILS = [
  'johan.manoj@zertainity.in',
  'viney.ragesh@zertainity.in'
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactRequest = await req.json();

    if (!name || !email || !message) {
      throw new Error('Missing required fields: name, email, message');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email address');
    }

    // Validate lengths
    if (name.length > 100 || email.length > 255 || message.length > 2000) {
      throw new Error('Input exceeds maximum length');
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      console.log('RESEND_API_KEY not configured - logging contact form submission');
      console.log(`Contact from: ${name} (${email}), Subject: ${subject}, Message: ${message}`);
      return new Response(
        JSON.stringify({ success: true, message: 'Contact form received (email not configured)' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const resend = new Resend(resendApiKey);

    // Send notification to owners
    await resend.emails.send({
      from: 'Zertainity <noreply@send.zertainity.in>',
      to: OWNER_EMAILS,
      replyTo: email,
      subject: `[Zertainity Contact] ${subject} - from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .content {
              padding: 30px 20px;
              background: #f9fafb;
            }
            .field {
              margin-bottom: 20px;
              padding: 15px;
              background: white;
              border-radius: 8px;
              border-left: 4px solid #667eea;
            }
            .label {
              font-weight: 600;
              color: #667eea;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 5px;
            }
            .value {
              color: #1f2937;
              font-size: 15px;
              word-wrap: break-word;
              white-space: pre-wrap;
            }
            .footer {
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              background: #f3f4f6;
            }
            .reply-button {
              display: inline-block;
              margin-top: 20px;
              padding: 12px 24px;
              background: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">From</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></div>
              </div>
              <div class="field">
                <div class="label">Subject</div>
                <div class="value">${subject}</div>
              </div>
              <div class="field">
                <div class="label">Message</div>
                <div class="value">${message}</div>
              </div>
              <div style="text-align: center;">
                <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" class="reply-button">Reply to ${name}</a>
              </div>
            </div>
            <div class="footer">
              <p>This email was sent from the Zertainity contact form.</p>
              <p>Click "Reply to ${name}" above or reply directly to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Send confirmation to user
    await resend.emails.send({
      from: 'Zertainity <noreply@send.zertainity.in>',
      to: [email],
      subject: 'We received your message - Zertainity',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px 20px;
              text-align: center;
            }
            .content {
              padding: 30px 20px;
            }
            .footer {
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              background: #f3f4f6;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Message Received!</h1>
            </div>
            <div class="content">
              <h2 style="color: #333; margin-top: 0;">Thanks for reaching out, ${name}!</h2>
              <p>We've received your message about <strong>${subject}</strong> and will get back to you within 24 hours.</p>
              <p style="color: #666; margin-top: 30px;">
                Best regards,<br>
                <strong>The Zertainity Team</strong>
              </p>
            </div>
            <div class="footer">
              <p>Zertainity - AI-Powered Career Guidance</p>
              <p><a href="https://zertainity.in" style="color: #667eea; text-decoration: none;">www.zertainity.in</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error('Error in send-contact:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
