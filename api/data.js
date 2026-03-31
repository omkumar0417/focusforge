const connectToDatabase = require('../lib/mongodb');
const { requireUser } = require('../lib/auth');

module.exports = async function handler(req, res) {
  try {
    await connectToDatabase();
    const user = await requireUser(req);

    if (req.method === 'GET') {
      return res.json({
        success: true,
        data: user.data || {},
      });
    }

    if (req.method === 'PUT') {
      const body = req.body || {};
      const nextData = { ...(user.data || {}) };

      if (body.data && typeof body.data === 'object') {
        for (const [key, value] of Object.entries(body.data)) {
          nextData[key] = value;
        }
      }

      if (body.key !== undefined) {
        nextData[body.key] = body.value;
      }

      user.data = nextData;
      await user.save();

      return res.json({
        success: true,
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
