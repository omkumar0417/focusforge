const express = require('express');
const { protect } = require('../middleware/auth');
const { SpringBootProgress, Academics, Health, Communication, Distraction } = require('../models/OtherModels');

// SpringBoot Router
const springbootRouter = express.Router();
springbootRouter.get('/', protect, async (req, res) => {
  try {
    const topics = await SpringBootProgress.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, topics });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
springbootRouter.post('/', protect, async (req, res) => {
  try {
    const topic = await SpringBootProgress.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, topic });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
springbootRouter.patch('/:id', protect, async (req, res) => {
  try {
    const topic = await SpringBootProgress.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true });
    res.json({ success: true, topic });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Academics Router
const academicsRouter = express.Router();
academicsRouter.get('/', protect, async (req, res) => {
  try {
    const entries = await Academics.find({ userId: req.user._id }).sort({ date: -1 });
    res.json({ success: true, entries });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
academicsRouter.post('/', protect, async (req, res) => {
  try {
    const entry = await Academics.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, entry });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Health Router
const healthRouter = express.Router();
healthRouter.get('/today', protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let entry = await Health.findOne({ userId: req.user._id, date: today });
    if (!entry) entry = await Health.create({ userId: req.user._id, date: today });
    res.json({ success: true, entry });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
healthRouter.put('/today', protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const entry = await Health.findOneAndUpdate({ userId: req.user._id, date: today }, req.body, { new: true, upsert: true });
    res.json({ success: true, entry });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
healthRouter.get('/history', protect, async (req, res) => {
  try {
    const entries = await Health.find({ userId: req.user._id }).sort({ date: -1 }).limit(30);
    res.json({ success: true, entries });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Communication Router
const communicationRouter = express.Router();
communicationRouter.get('/', protect, async (req, res) => {
  try {
    const logs = await Communication.find({ userId: req.user._id }).sort({ date: -1 });
    res.json({ success: true, logs });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
communicationRouter.post('/', protect, async (req, res) => {
  try {
    const log = await Communication.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, log });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Distraction Router
const distractionRouter = express.Router();
distractionRouter.get('/today', protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let entry = await Distraction.findOne({ userId: req.user._id, date: today });
    if (!entry) entry = await Distraction.create({ userId: req.user._id, date: today });
    res.json({ success: true, entry });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
distractionRouter.put('/today', protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const entry = await Distraction.findOneAndUpdate({ userId: req.user._id, date: today }, req.body, { new: true, upsert: true });
    res.json({ success: true, entry });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Analytics Router
const Task = require('../models/Task');
const analyticsRouter = express.Router();
analyticsRouter.get('/weekly', protect, async (req, res) => {
  try {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const tasks = await Task.find({ userId: req.user._id, date: dateStr });
      const completed = tasks.filter(t => t.completed).length;
      days.push({ date: dateStr, total: tasks.length, completed, percentage: tasks.length ? Math.round((completed / tasks.length) * 100) : 0 });
    }
    res.json({ success: true, days });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
analyticsRouter.get('/monthly', protect, async (req, res) => {
  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    const tasks = await Task.find({ userId: req.user._id, date: { $gte: firstDay, $lte: lastDay } });
    const byCategory = {};
    tasks.forEach(t => {
      if (!byCategory[t.category]) byCategory[t.category] = { total: 0, completed: 0 };
      byCategory[t.category].total++;
      if (t.completed) byCategory[t.category].completed++;
    });
    res.json({ success: true, byCategory, total: tasks.length, completed: tasks.filter(t => t.completed).length });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// User Router
const User = require('../models/User');
const userRouter = express.Router();
userRouter.put('/profile', protect, async (req, res) => {
  try {
    const { name, theme, phoneUsageLimit } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, theme, phoneUsageLimit }, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
userRouter.get('/streak', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('streak longestStreak lastActiveDate');
    res.json({ success: true, streak: user.streak, longestStreak: user.longestStreak });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = { springbootRouter, academicsRouter, healthRouter, communicationRouter, distractionRouter, analyticsRouter, userRouter };
