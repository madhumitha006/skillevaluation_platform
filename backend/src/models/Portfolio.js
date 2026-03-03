const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  personalInfo: {
    displayName: String,
    title: String,
    bio: String,
    aiGeneratedBio: String,
    location: String,
    website: String,
    avatar: String,
    contactEmail: String,
    phone: String,
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
      portfolio: String
    }
  },
  skills: [{
    name: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      required: true
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    category: {
      type: String,
      enum: ['Technical', 'Soft Skills', 'Languages', 'Tools', 'Frameworks'],
      default: 'Technical'
    },
    yearsOfExperience: Number,
    isVisible: {
      type: Boolean,
      default: true
    }
  }],
  certifications: [{
    name: {
      type: String,
      required: true
    },
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    credentialId: String,
    credentialUrl: String,
    logo: String,
    isVisible: {
      type: Boolean,
      default: true
    }
  }],
  achievements: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    date: Date,
    type: {
      type: String,
      enum: ['Award', 'Competition', 'Project', 'Recognition', 'Publication'],
      default: 'Achievement'
    },
    organization: String,
    url: String,
    isVisible: {
      type: Boolean,
      default: true
    }
  }],
  experience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    isCurrent: Boolean,
    description: String,
    technologies: [String],
    isVisible: {
      type: Boolean,
      default: true
    }
  }],
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    url: String,
    githubUrl: String,
    image: String,
    startDate: Date,
    endDate: Date,
    isVisible: {
      type: Boolean,
      default: true
    }
  }],
  theme: {
    primaryColor: {
      type: String,
      default: '#3B82F6'
    },
    layout: {
      type: String,
      enum: ['modern', 'classic', 'minimal', 'creative'],
      default: 'modern'
    }
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    uniqueViews: {
      type: Number,
      default: 0
    },
    lastViewed: Date
  },
  seoSettings: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

portfolioSchema.index({ slug: 1 });
portfolioSchema.index({ user: 1 });
portfolioSchema.index({ isPublic: 1 });

// Generate slug from user name
portfolioSchema.pre('save', function(next) {
  if (this.isNew && !this.slug) {
    const baseSlug = this.personalInfo.displayName 
      ? this.personalInfo.displayName.toLowerCase().replace(/[^a-z0-9]/g, '-')
      : `user-${this.user.toString().slice(-6)}`;
    this.slug = baseSlug.replace(/-+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Portfolio', portfolioSchema);