const connectToDatabase = require('../../lib/mongodb');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    const { email, code, newPassword } = req.body || {};
    const normalizedEmail = String(email || '').toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    if (!newPassword || String(newPassword).length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    if (!user.resetOtpHash || !user.resetOtpExpiresAt) {
      return res.status(400).json({ success: false, message: 'Reset code expired. Please request a new one.' });
    }

    if (new Date(user.resetOtpExpiresAt).getTime() < Date.now()) {
      return res.status(400).json({ success: false, message: 'Reset code expired. Please request a new one.' });
    }

    user.resetOtpAttempts = (user.resetOtpAttempts || 0) + 1;
    const valid = await bcrypt.compare(String(code || ''), user.resetOtpHash);
    if (!valid) {
      await user.save();
      return res.status(400).json({ success: false, message: 'Invalid reset code' });
    }

    user.password = newPassword;
    user.resetOtpHash = null;
    user.resetOtpExpiresAt = null;
    user.resetOtpSentAt = null;
    user.resetOtpAttempts = 0;
    await user.save();

    return res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};
