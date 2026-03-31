const connectToDatabase = require('../../lib/mongodb');
const User = require('../../models/User');
const { serializeUser, signToken } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    const { email, password } = req.body || {};
    const normalizedEmail = String(email || '').toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await user.matchPassword(password || ''))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const today = new Date().toISOString().split('T')[0];
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate).toISOString().split('T')[0] : null;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (lastActive === yesterday) {
      user.streak = (user.streak || 0) + 1;
      if (user.streak > (user.longestStreak || 0)) user.longestStreak = user.streak;
    } else if (lastActive !== today) {
      user.streak = 1;
    }

    user.lastActiveDate = new Date();
    await user.save();

    return res.json({
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
