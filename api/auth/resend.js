const connectToDatabase = require('../../lib/mongodb');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendOtpEmail } = require('../../lib/mailer');

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
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    if (user.emailVerified !== false) {
      return res.json({ success: true, message: 'Email already verified' });
    }

    if (user.emailOtpSentAt && (Date.now() - new Date(user.emailOtpSentAt).getTime()) < 60 * 1000) {
      return res.status(429).json({ success: false, message: 'Please wait before requesting another code' });
    }

    const otp = String(crypto.randomInt(100000, 999999));
    user.emailOtpHash = await bcrypt.hash(otp, 10);
    user.emailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.emailOtpSentAt = new Date();
    user.emailOtpAttempts = 0;
    await user.save();

    await sendOtpEmail({ to: user.email, name: user.name, code: otp });

    return res.json({ success: true, message: 'Verification code resent' });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};
