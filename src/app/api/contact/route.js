import { NextResponse } from 'next/server';

// Basic email format regex
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // ── Send email via Resend ─────────────────────────────────────────────────
    // To enable real email delivery:
    // 1. npm install resend
    // 2. Add RESEND_API_KEY and CONTACT_EMAIL to your .env file
    // 3. Uncomment the block below
    //
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'portfolio@yourdomain.com',
    //   to: process.env.CONTACT_EMAIL,
    //   subject: `[Portfolio Contact] ${subject}`,
    //   html: `
    //     <h2>New message from your portfolio</h2>
    //     <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
    //     <p><strong>Subject:</strong> ${subject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message.replace(/\n/g, '<br>')}</p>
    //   `,
    // });

    // Temporary: log to server console until email provider is configured
    console.info('📧 Contact form submission (not yet emailed):');
    console.info(`From: ${name} <${email}>`);
    console.info(`Subject: ${subject}`);
    console.info(`Message: ${message}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
