const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    category: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    skills: [String],
    modules: [{
      id: String,
      title: String,
      description: String,
      type: {
        type: String,
        enum: ['video', 'text', 'quiz', 'coding'],
        required: true,
      },
      content: {
        videoUrl: String,
        text: String,
        code: String,
        language: String,
        quiz: [{
          question: String,
          options: [String],
          correctAnswer: Number,
          explanation: String,
        }],
      },
      duration: Number, // in minutes
      xpReward: { type: Number, default: 10 },
      order: Number,
    }],
    totalDuration: Number,
    totalXP: Number,
    prerequisites: [String],
    tags: [String],
    isPublished: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

courseSchema.index({ category: 1, difficulty: 1 });
courseSchema.index({ skills: 1 });
courseSchema.index({ isPublished: 1 });

module.exports = mongoose.model('Course', courseSchema);