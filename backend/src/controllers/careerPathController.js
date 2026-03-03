const CareerPath = require('../models/CareerPath');
const CareerPathAgent = require('../agents/CareerPathAgent');
const { validationResult } = require('express-validator');

const careerPathController = {
  // Create career path simulation
  async createSimulation(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const careerPath = await CareerPathAgent.simulateCareerPath(req.user.id, req.body);

      res.status(201).json({
        success: true,
        message: 'Career path simulation created successfully',
        data: careerPath
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create career path simulation',
        error: error.message
      });
    }
  },

  // Get user's career paths
  async getCareerPaths(req, res) {
    try {
      const careerPaths = await CareerPathAgent.getUserCareerPaths(req.user.id);

      res.json({
        success: true,
        data: careerPaths
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get career paths',
        error: error.message
      });
    }
  },

  // Get specific career path
  async getCareerPath(req, res) {
    try {
      const { id } = req.params;
      
      const careerPath = await CareerPath.findOne({
        _id: id,
        user: req.user.id
      });

      if (!careerPath) {
        return res.status(404).json({
          success: false,
          message: 'Career path not found'
        });
      }

      res.json({
        success: true,
        data: careerPath
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get career path',
        error: error.message
      });
    }
  },

  // Compare multiple career paths
  async compareCareerPaths(req, res) {
    try {
      const { pathIds } = req.body;
      
      if (!pathIds || !Array.isArray(pathIds) || pathIds.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'At least 2 career path IDs are required for comparison'
        });
      }

      const comparison = await CareerPathAgent.compareCareerPaths(req.user.id, pathIds);

      res.json({
        success: true,
        data: comparison
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to compare career paths',
        error: error.message
      });
    }
  },

  // Update career path milestone
  async updateMilestone(req, res) {
    try {
      const { id, milestoneIndex } = req.params;
      const { completed } = req.body;

      const careerPath = await CareerPath.findOne({
        _id: id,
        user: req.user.id
      });

      if (!careerPath) {
        return res.status(404).json({
          success: false,
          message: 'Career path not found'
        });
      }

      if (milestoneIndex >= careerPath.milestones.length) {
        return res.status(400).json({
          success: false,
          message: 'Invalid milestone index'
        });
      }

      careerPath.milestones[milestoneIndex].completed = completed;
      await careerPath.save();

      res.json({
        success: true,
        message: 'Milestone updated successfully',
        data: careerPath.milestones[milestoneIndex]
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update milestone',
        error: error.message
      });
    }
  },

  // Delete career path
  async deleteCareerPath(req, res) {
    try {
      const { id } = req.params;
      
      const careerPath = await CareerPath.findOneAndDelete({
        _id: id,
        user: req.user.id
      });

      if (!careerPath) {
        return res.status(404).json({
          success: false,
          message: 'Career path not found'
        });
      }

      res.json({
        success: true,
        message: 'Career path deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete career path',
        error: error.message
      });
    }
  },

  // Get available career roles by industry
  async getCareerRoles(req, res) {
    try {
      const { industry = 'technology' } = req.query;
      
      const roles = {
        technology: [
          'Junior Developer',
          'Mid-Level Developer', 
          'Senior Developer',
          'Tech Lead',
          'Engineering Manager',
          'Principal Engineer'
        ],
        finance: [
          'Financial Analyst',
          'Senior Analyst',
          'Portfolio Manager',
          'VP Finance',
          'CFO'
        ]
      };

      res.json({
        success: true,
        data: roles[industry] || roles.technology
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get career roles',
        error: error.message
      });
    }
  }
};

module.exports = careerPathController;