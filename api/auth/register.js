const connectToDatabase = require('../../lib/mongodb');
const User = require('../../backend/models/User');
const { serializeUser, signToken } = require('../../lib/auth');

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
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const today = new Date().toISOString().split('T')[0];
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      startDate: today,
      lastActiveDate: new Date(),
      streak: 1,
      longestStreak: 1,
      data: {},
    });

    return res.status(201).json({
      success: true,
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
