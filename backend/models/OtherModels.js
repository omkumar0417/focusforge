const mongoose = require('mongoose');

// SpringBoot Progress
const springBootSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  subtopic: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  projectLink: { type: String, default: '' },
  githubLink: { type: String, default: '' },
  notes: { type: String, default: '' },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Academics
const academicsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  studyHours: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Health
const healthSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  waterIntake: { type: Number, default: 0 }, // glasses
  exerciseDone: { type: Boolean, default: false },
  exerciseMinutes: { type: Number, default: 0 },
  sleepHours: { type: Number, default: 0 },
  sleepQuality: { type: String, enum: ['poor', 'fair', 'good', 'excellent'], default: 'fair' },
  mood: { type: String, enum: ['😴', '😐', '🙂', '😄', '🚀'], default: '🙂' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Communication
const communicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topicSpoken: { type: String, required: true },
  type: { type: String, enum: ['English', 'Technical', 'Interview', 'Presentation', 'Other'], default: 'English' },
  rating: { type: Number, min: 1, max: 5, default: 3 },
  notes: { type: String, default: '' },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Distraction
const distractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  phoneUsageHours: { type: Number, default: 0 },
  socialMedia: { type: Number, default: 0 }, // minutes
  distractedBy: { type: String, default: '' },
  focusScore: { type: Number, min: 1, max: 10, default: 5 },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  SpringBootProgress: mongoose.model('SpringBootProgress', springBootSchema),
  Academics: mongoose.model('Academics', academicsSchema),
  Health: mongoose.model('Health', healthSchema),
  Communication: mongoose.model('Communication', communicationSchema),
  Distraction: mongoose.model('Distraction', distractionSchema)
};
