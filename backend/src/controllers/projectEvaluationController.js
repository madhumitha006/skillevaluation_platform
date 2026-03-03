const ProjectEvaluation = require('../models/ProjectEvaluation');
const ProjectEvaluationAgent = require('../agents/ProjectEvaluationAgent');
const { validationResult } = require('express-validator');

const projectEvaluationController = {
  // Submit project for evaluation
  async submitProject(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const projectData = {
        ...req.body,
        user: req.user.id
      };

      // Start evaluation process
      const evaluation = await ProjectEvaluationAgent.evaluateProject(projectData);

      res.status(201).json({
        success: true,
        message: 'Project submitted for evaluation successfully',
        data: evaluation
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to submit project for evaluation',
        error: error.message
      });
    }
  },

  // Get evaluation by ID
  async getEvaluation(req, res) {
    try {
      const { id } = req.params;
      
      const evaluation = await ProjectEvaluation.findOne({
        _id: id,
        user: req.user.id
      }).populate('user', 'name email');

      if (!evaluation) {
        return res.status(404).json({
          success: false,
          message: 'Evaluation not found'
        });
      }

      res.json({
        success: true,
        data: evaluation
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get evaluation',
        error: error.message
      });
    }
  },

  // Get user's evaluation history
  async getEvaluationHistory(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      
      const evaluations = await ProjectEvaluation.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('projectName overallScore grade evaluatedAt processingTime evaluationStatus');

      const total = await ProjectEvaluation.countDocuments({ user: req.user.id });

      res.json({
        success: true,
        data: {
          evaluations,
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
        message: 'Failed to get evaluation history',
        error: error.message
      });
    }
  },

  // Get evaluation statistics
  async getEvaluationStats(req, res) {
    try {
      const userId = req.user.id;

      const [
        totalEvaluations,
        averageScore,
        gradeDistribution,
        recentEvaluations
      ] = await Promise.all([
        ProjectEvaluation.countDocuments({ user: userId, evaluationStatus: 'completed' }),
        
        ProjectEvaluation.aggregate([
          { $match: { user: userId, evaluationStatus: 'completed' } },
          { $group: { _id: null, avgScore: { $avg: '$overallScore' } } }
        ]),

        ProjectEvaluation.aggregate([
          { $match: { user: userId, evaluationStatus: 'completed' } },
          { $group: { _id: '$grade', count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ]),

        ProjectEvaluation.find({ user: userId, evaluationStatus: 'completed' })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('projectName overallScore grade evaluatedAt')
      ]);

      const stats = {
        totalEvaluations,
        averageScore: averageScore[0]?.avgScore ? Math.round(averageScore[0].avgScore) : 0,
        gradeDistribution: gradeDistribution.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentEvaluations,
        improvementTrend: await this.calculateImprovementTrend(userId)
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get evaluation statistics',
        error: error.message
      });
    }
  },

  // Delete evaluation
  async deleteEvaluation(req, res) {
    try {
      const { id } = req.params;
      
      const evaluation = await ProjectEvaluation.findOneAndDelete({
        _id: id,
        user: req.user.id
      });

      if (!evaluation) {
        return res.status(404).json({
          success: false,
          message: 'Evaluation not found'
        });
      }

      res.json({
        success: true,
        message: 'Evaluation deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete evaluation',
        error: error.message
      });
    }
  },

  // Get evaluation report (formatted for display)
  async getEvaluationReport(req, res) {
    try {
      const { id } = req.params;
      
      const evaluation = await ProjectEvaluation.findOne({
        _id: id,
        user: req.user.id,
        evaluationStatus: 'completed'
      });

      if (!evaluation) {
        return res.status(404).json({
          success: false,
          message: 'Evaluation report not found'
        });
      }

      // Format report data
      const report = {
        projectInfo: {
          name: evaluation.projectName,
          description: evaluation.description,
          githubUrl: evaluation.githubUrl,
          technologies: evaluation.technologies,
          type: evaluation.projectType
        },
        summary: {
          overallScore: evaluation.overallScore,
          grade: evaluation.grade,
          evaluatedAt: evaluation.evaluatedAt,
          processingTime: evaluation.processingTime
        },
        breakdown: evaluation.evaluationCriteria,
        analysis: evaluation.aiAnalysis,
        insights: {
          strengths: evaluation.strengths,
          weaknesses: evaluation.weaknesses,
          recommendations: evaluation.recommendations
        }
      };

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get evaluation report',
        error: error.message
      });
    }
  },

  // Helper method to calculate improvement trend
  async calculateImprovementTrend(userId) {
    try {
      const recentEvaluations = await ProjectEvaluation.find({
        user: userId,
        evaluationStatus: 'completed'
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('overallScore createdAt');

      if (recentEvaluations.length < 2) {
        return { trend: 'insufficient_data', change: 0 };
      }

      const latest = recentEvaluations[0].overallScore;
      const previous = recentEvaluations[1].overallScore;
      const change = latest - previous;

      return {
        trend: change > 0 ? 'improving' : change < 0 ? 'declining' : 'stable',
        change: Math.round(change)
      };
    } catch (error) {
      return { trend: 'error', change: 0 };
    }
  }
};

module.exports = projectEvaluationController;