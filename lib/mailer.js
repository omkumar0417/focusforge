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

async function sendCodeEmail({ to, name, code, purpose = 'verification' }) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const transporter = getTransport();
  const isReset = purpose === 'reset';
  const subject = isReset ? 'Your FocusForge password reset code' : 'Your FocusForge verification code';
  const title = isReset ? 'FocusForge password reset code' : 'FocusForge verification code';
  const intro = isReset ? 'Use this code to reset your FocusForge password.' : 'Use this code to verify your FocusForge account.';

  await transporter.sendMail({
    from,
    to,
    subject,
    text: `Hi ${name || 'there'}, ${intro} Your code is ${code}. It expires in 10 minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
        <h2 style="margin:0 0 12px">${title}</h2>
        <p>Hi ${name || 'there'},</p>
        <p>${intro}</p>
        <div style="font-size:32px;font-weight:700;letter-spacing:4px;margin:20px 0;color:#f97316">${code}</div>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  });
}

module.exports = {
  sendCodeEmail,
  sendOtpEmail: (args) => sendCodeEmail({ ...args, purpose: 'verification' }),
  sendResetEmail: (args) => sendCodeEmail({ ...args, purpose: 'reset' }),
};
