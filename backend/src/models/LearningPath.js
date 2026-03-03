const mongoose = require('mongoose');

const learningPathSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: String,
    targetSkills: [String],
    skillGaps: [{
      skill: String,
      currentLevel: Number,
      targetLevel: Number,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
      },
    }],
    courses: [{
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
      order: Number,
      status: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed'],
        default: 'not-started',
      },
      startedAt: Date,
      completedAt: Date,
      progress: { type: Number, default: 0 },
    }],
    estimatedDuration: Number, // in hours
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active',
    },
    aiGenerated: { type: Boolean, default: true },
    lastUpdated: Date,
  },
  {
    timestamps: true,
  }
);

learningPathSchema.index({ userId: 1, status: 1 });
learningPathSchema.index({ targetSkills: 1 });

module.exports = mongoose.model('LearningPath', learningPathSchema);