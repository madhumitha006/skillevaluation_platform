const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    testId: {
      type: String,
      required: true,
    },
    skills: [String],
    questions: [{
      id: String,
      skill: String,
      difficulty: String,
      type: String,
      question: String,
    }],
    responses: [{
      questionId: String,
      answer: mongoose.Schema.Types.Mixed,
      correct: Boolean,
      responseTime: Number,
      confidence: Number,
      difficulty: String,
      submittedAt: Date,
    }],
    adaptiveState: {
      currentDifficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
      },
      correctStreak: { type: Number, default: 0 },
      incorrectStreak: { type: Number, default: 0 },
      averageResponseTime: { type: Number, default: 0 },
      adjustmentHistory: [{
        timestamp: Date,
        oldDifficulty: String,
        newDifficulty: String,
        reason: String,
        difficultyScore: Number,
        correctStreak: Number,
        incorrectStreak: Number,
      }],
    },
    evaluation: {
      totalScore: Number,
      maxScore: Number,
      percentage: Number,
      grade: String,
      results: Array,
      analysis: Object,
    },
    strengths: Array,
    weaknesses: Array,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'expired'],
      default: 'pending',
    },
    startedAt: Date,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

assessmentSchema.index({ userId: 1, createdAt: -1 });
assessmentSchema.index({ testId: 1 }, { unique: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
