// dsa.js
const express = require('express');
const router = express.Router();
const DSAProgress = require('../models/DSAProgress');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const problems = await DSAProgress.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const stats = {
      total: problems.length,
      easy: problems.filter(p => p.difficulty === 'Easy').length,
      medium: problems.filter(p => p.difficulty === 'Medium').length,
      hard: problems.filter(p => p.difficulty === 'Hard').length,
    };
    res.json({ success: true, problems, stats });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const problem = await DSAProgress.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, problem });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await DSAProgress.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

module.exports = router;
