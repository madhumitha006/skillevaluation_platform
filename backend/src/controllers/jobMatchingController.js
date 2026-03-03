const JobRole = require('../models/JobRole');
const JobMatch = require('../models/JobMatch');
const JobMatchingAgent = require('../agents/JobMatchingAgent');
const { validationResult } = require('express-validator');

const jobMatchingController = {
  // Create new job role (Recruiters only)
  async createJobRole(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const jobRole = new JobRole({
        ...req.body,
        company: req.tenant._id,
        postedBy: req.user.id
      });

      await jobRole.save();

      res.status(201).json({
        success: true,
        message: 'Job role created successfully',
        data: jobRole
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create job role',
        error: error.message
      });
    }
  },

  // Get all active job roles
  async getJobRoles(req, res) {
    try {
      const { page = 1, limit = 10, search, experienceLevel } = req.query;
      const query = { 
        isActive: true,
        company: req.tenant._id
      };

      if (search) {
        query.$text = { $search: search };
      }

      if (experienceLevel) {
        query.experienceLevel = experienceLevel;
      }

      const jobRoles = await JobRole.find(query)
        .populate('postedBy', 'name')
        .populate('company', 'name')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await JobRole.countDocuments(query);

      res.json({
        success: true,
        data: {
          jobRoles,
          pagination: {
            current: page,
            pages: Math.ceil(total / limit),
            total
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch job roles',
        error: error.message
      });
    }
  },

  // Get job role by ID
  async getJobRole(req, res) {
    try {
      const jobRole = await JobRole.findOne({
        _id: req.params.id,
        company: req.tenant._id
      })
      .populate('postedBy', 'name')
      .populate('company', 'name');

      if (!jobRole) {
        return res.status(404).json({
          success: false,
          message: 'Job role not found'
        });
      }

      res.json({
        success: true,
        data: jobRole
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch job role',
        error: error.message
      });
    }
  },

  // Get matching jobs for current user
  async getMatchingJobs(req, res) {
    try {
      const { limit = 10 } = req.query;
      const matches = await JobMatchingAgent.findMatchingJobs(req.user.id, parseInt(limit));

      res.json({
        success: true,
        data: matches
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to find matching jobs',
        error: error.message
      });
    }
  },

  // Calculate match score for specific job
  async calculateJobMatch(req, res) {
    try {
      const { jobId } = req.params;
      const match = await JobMatchingAgent.calculateJobMatch(req.user.id, jobId);

      res.json({
        success: true,
        data: match
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to calculate job match',
        error: error.message
      });
    }
  },

  // Get detailed match analysis
  async getJobMatchDetails(req, res) {
    try {
      const { jobId } = req.params;
      const matchDetails = await JobMatchingAgent.getJobMatchDetails(req.user.id, jobId);

      res.json({
        success: true,
        data: matchDetails
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get match details',
        error: error.message
      });
    }
  },

  // Get skill gap analysis
  async getSkillGapAnalysis(req, res) {
    try {
      const analysis = await JobMatchingAgent.getSkillGapAnalysis(req.user.id);

      res.json({
        success: true,
        data: analysis
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get skill gap analysis',
        error: error.message
      });
    }
  },

  // Bookmark/unbookmark job
  async toggleBookmark(req, res) {
    try {
      const { jobId } = req.params;
      
      const jobMatch = await JobMatch.findOne({ user: req.user.id, jobRole: jobId });
      
      if (!jobMatch) {
        // Create match first if doesn't exist
        await JobMatchingAgent.calculateJobMatch(req.user.id, jobId);
      }

      const updatedMatch = await JobMatch.findOneAndUpdate(
        { user: req.user.id, jobRole: jobId },
        { $set: { isBookmarked: !jobMatch?.isBookmarked } },
        { new: true }
      );

      res.json({
        success: true,
        data: { isBookmarked: updatedMatch.isBookmarked }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to toggle bookmark',
        error: error.message
      });
    }
  },

  // Get bookmarked jobs
  async getBookmarkedJobs(req, res) {
    try {
      const bookmarkedJobs = await JobMatch.find({ 
        user: req.user.id, 
        isBookmarked: true 
      })
      .populate('jobRole')
      .sort({ updatedAt: -1 });

      res.json({
        success: true,
        data: bookmarkedJobs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get bookmarked jobs',
        error: error.message
      });
    }
  }
};

module.exports = jobMatchingController;