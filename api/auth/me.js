const connectToDatabase = require('../../lib/mongodb');
const { requireUser, serializeUser } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      await connectToDatabase();
      const user = await requireUser(req);
      return res.json({
        success: true,
        user: serializeUser(user),
        data: user.data || {},
      });
    }

    if (req.method === 'PUT') {
      await connectToDatabase();
      const user = await requireUser(req);
      const body = req.body || {};

      if (body.theme !== undefined) user.theme = body.theme;
      if (body.phoneLimit !== undefined) user.phoneUsageLimit = Number(body.phoneLimit);
      if (body.phoneUsageLimit !== undefined) user.phoneUsageLimit = Number(body.phoneUsageLimit);
      if (body.startDate !== undefined) user.startDate = body.startDate;
      if (body.name !== undefined) user.name = body.name;
      if (body.streak !== undefined) user.streak = Number(body.streak);
      if (body.longestStreak !== undefined) user.longestStreak = Number(body.longestStreak);
      if (body.lastActiveDate !== undefined) user.lastActiveDate = body.lastActiveDate;

      await user.save();
      return res.json({
        success: true,
        user: serializeUser(user),
        data: user.data || {},
      });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};
