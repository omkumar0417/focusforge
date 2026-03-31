const nodemailer = require('nodemailer');

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('Missing SMTP_HOST, SMTP_USER, or SMTP_PASS environment variables');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: { user, pass },
  });
}

async function sendOtpEmail({ to, name, code }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const transporter = getTransport();

  await transporter.sendMail({
    from,
    to,
    subject: 'Your FocusForge verification code',
    text: `Hi ${name || 'there'}, your FocusForge verification code is ${code}. It expires in 10 minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
        <h2 style="margin:0 0 12px">FocusForge verification code</h2>
        <p>Hi ${name || 'there'},</p>
        <p>Your verification code is:</p>
        <div style="font-size:32px;font-weight:700;letter-spacing:4px;margin:20px 0;color:#f97316">${code}</div>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  });
}

module.exports = { sendOtpEmail };
