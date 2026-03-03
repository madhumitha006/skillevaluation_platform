const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    moduleProgress: [{
      moduleId: String,
      status: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed'],
        default: 'not-started',
      },
      startedAt: Date,
      completedAt: Date,
      timeSpent: { type: Number, default: 0 }, // in minutes
      attempts: { type: Number, default: 0 },
      score: Number,
      lastAccessed: Date,
    }],
    overallProgress: { type: Number, default: 0 }, // percentage
    totalTimeSpent: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started',
    },
    startedAt: Date,
    completedAt: Date,
    lastAccessed: Date,
    revisionSchedule: [{
      moduleId: String,
      nextReviewDate: Date,
      reviewCount: { type: Number, default: 0 },
      difficulty: { type: Number, default: 2.5 }, // for spaced repetition
    }],
  },
  {
    timestamps: true,
  }
);

userProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
userProgressSchema.index({ userId: 1, status: 1 });
userProgressSchema.index({ 'revisionSchedule.nextReviewDate': 1 });

module.exports = mongoose.model('UserProgress', userProgressSchema);