const mongoose = require('mongoose');

const dsaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemName: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  topic: { type: String, default: '' }, // Arrays, Trees, DP, etc.
  link: { type: String, default: '' },
  solved: { type: Boolean, default: true },
  timeTaken: { type: Number, default: 0 }, // minutes
  notes: { type: String, default: '' },
  date: { type: String, required: true }, // YYYY-MM-DD
  createdAt: { type: Date, default: Date.now }
});

dsaSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('DSAProgress', dsaSchema);
