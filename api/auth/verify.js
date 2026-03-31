const connectToDatabase = require('../../lib/mongodb');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const { serializeUser, signToken } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    const { email, code } = req.body || {};
    const normalizedEmail = String(email || '').toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    if (user.emailVerified !== false) {
      return res.json({
        success: true,
        token: signToken(user._id),
        user: serializeUser(user),
        data: user.data || {},
      });
    }

    if (!user.emailOtpHash || !user.emailOtpExpiresAt) {
      return res.status(400).json({ success: false, message: 'Verification code expired. Please resend it.' });
    }

    if (new Date(user.emailOtpExpiresAt).getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: 'Verification code expired. Please resend it.' });
    }

    user.emailOtpAttempts = (user.emailOtpAttempts || 0) + 1;
    const valid = await bcrypt.compare(String(code || ''), user.emailOtpHash);

    if (!valid) {
      await user.save();
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }

    const today = new Date().toISOString().split('T')[0];
    user.emailVerified = true;
    user.emailOtpHash = null;
    user.emailOtpExpiresAt = null;
    user.emailOtpSentAt = null;
    user.emailOtpAttempts = 0;
    user.startDate = user.startDate || today;
    user.streak = user.streak || 1;
    user.longestStreak = Math.max(user.longestStreak || 0, user.streak);
    user.lastActiveDate = new Date();
    await user.save();

    return res.json({
      success: true,
      message: 'Email verified successfully',
      token: signToken(user._id),
      user: serializeUser(user),
      data: user.data || {},
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};
