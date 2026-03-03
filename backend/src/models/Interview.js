const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    skills: [String],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    questions: [{
      id: String,
      question: String,
      expectedAnswer: String,
      difficulty: String,
      skill: String,
      type: {
        type: String,
        enum: ['technical', 'behavioral', 'situational'],
        default: 'technical',
      },
      followUp: [String],
    }],
    responses: [{
      questionId: String,
      answer: String,
      transcript: String,
      confidence: Number,
      sentiment: {
        score: Number,
        label: String,
      },
      responseTime: Number,
      submittedAt: Date,
    }],
    evaluation: {
      overallScore: Number,
      skillScores: Map,
      strengths: [String],
      improvements: [String],
      feedback: String,
      recommendation: String,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    startedAt: Date,
    completedAt: Date,
    duration: Number,
  },
  {
    timestamps: true,
  }
);

interviewSchema.index({ userId: 1, createdAt: -1 });
interviewSchema.index({ status: 1 });

module.exports = mongoose.model('Interview', interviewSchema);