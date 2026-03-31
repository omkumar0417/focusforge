const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  category: {
    type: String,
    enum: ['DSA', 'LeetCode', 'SpringBoot', 'Academics', 'Health', 'Communication'],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
  notes: { type: String, default: '' },
  timeSlot: { type: String, enum: ['morning', 'college', 'evening', 'night'], default: 'morning' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  day: { type: Number, default: 1 }, // Day 1-20
  createdAt: { type: Date, default: Date.now }
});

taskSchema.index({ userId: 1, date: 1 });
taskSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Task', taskSchema);
