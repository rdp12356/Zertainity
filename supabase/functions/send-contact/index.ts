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

    // Send notification to admin
    await resend.emails.send({
      from: 'Zertainity <zertainity@gmail.com>',
      to: ['zertainity@gmail.com'],
      subject: `[Zertainity Contact] ${subject} - from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Subject</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${subject}</td></tr>
          </table>
          <h3 style="margin-top: 20px;">Message:</h3>
          <div style="padding: 16px; background: #f5f5f5; border-radius: 8px; white-space: pre-wrap;">${message}</div>
        </div>
      `,
    });

    // Send confirmation to user
    await resend.emails.send({
      from: 'Zertainity <zertainity@gmail.com>',
      to: [email],
      subject: 'We received your message - Zertainity',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thanks for reaching out, ${name}!</h2>
          <p>We've received your message about <strong>${subject}</strong> and will get back to you within 24 hours.</p>
          <p style="color: #666; margin-top: 20px;">- The Zertainity Team</p>
        </div>
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
