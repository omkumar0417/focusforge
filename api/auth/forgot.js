const connectToDatabase = require('../../lib/mongodb');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendResetEmail } = require('../../lib/mailer');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    const { email } = req.body || {};
    const normalizedEmail = String(email || '').toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.json({ success: true, message: 'If an account exists, a reset code has been sent' });
    }

    const code = String(crypto.randomInt(100000, 999999));
    user.resetOtpHash = await bcrypt.hash(code, 10);
    user.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.resetOtpSentAt = new Date();
    user.resetOtpAttempts = 0;
    await user.save();

    await sendResetEmail({ to: user.email, name: user.name, code });

    return res.json({ success: true, message: 'Reset code sent to your email' });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};
