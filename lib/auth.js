const jwt = require('jsonwebtoken');
const User = require('../models/User');
const connectToDatabase = require('./mongodb');

function serializeUser(user) {
  if (!user) return null;
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    streak: user.streak || 0,
    longestStreak: user.longestStreak || 0,
    lastActiveDate: user.lastActiveDate || null,
    theme: user.theme || 'dark',
    phoneLimit: user.phoneUsageLimit ?? 2,
    startDate: user.startDate || null,
    createdAt: user.createdAt || null,
  };
}

async function requireUser(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    const err = new Error('Not authorized, no token');
    err.statusCode = 401;
    throw err;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  await connectToDatabase();
  const user = await User.findById(decoded.id);
  if (!user) {
    const err = new Error('Not authorized, user not found');
    err.statusCode = 401;
    throw err;
  }
  return user;
}

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

module.exports = {
  requireUser,
  serializeUser,
  signToken,
};
