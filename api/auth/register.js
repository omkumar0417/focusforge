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
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing && existing.emailVerified !== false) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const otp = String(crypto.randomInt(100000, 999999));
    const emailOtpHash = await bcrypt.hash(otp, 10);
    const emailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const today = new Date().toISOString().split('T')[0];

    let user = existing;
    if (user) {
      user.name = name;
      user.password = password;
      user.emailVerified = false;
      user.startDate = user.startDate || today;
      user.lastActiveDate = user.lastActiveDate || null;
      user.streak = user.streak || 0;
      user.longestStreak = user.longestStreak || 0;
    } else {
      user = new User({
        name,
        email: normalizedEmail,
        password,
        startDate: today,
        emailVerified: false,
        streak: 0,
        longestStreak: 0,
        data: {},
      });
    }

    user.emailOtpHash = emailOtpHash;
    user.emailOtpExpiresAt = emailOtpExpiresAt;
    user.emailOtpSentAt = new Date();
    user.emailOtpAttempts = 0;
    await user.save();

    await sendOtpEmail({ to: user.email, name: user.name, code: otp });

    return res.status(201).json({
      success: true,
      requiresVerification: true,
      message: 'Verification code sent to your email',
      email: user.email,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};
