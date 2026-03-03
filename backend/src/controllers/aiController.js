const aiService = require('../services/aiService');
const ApiResponse = require('../utils/ApiResponse');

class AIController {
  async analyzeResume(req, res, next) {
    try {
      const { resumeText } = req.body;
      const result = await aiService.analyzeResume(req.user._id, resumeText);
      return ApiResponse.success(res, result, 'Resume analyzed successfully');
    } catch (error) {
      next(error);
    }
  }

  async generateTest(req, res, next) {
    try {
      const { skills } = req.body;
      const realtimeService = req.app.get('realtimeService');
      const result = await aiService.generateAdaptiveTest(req.user._id, skills, realtimeService);
      return ApiResponse.success(res, result, 'Test generated successfully');
    } catch (error) {
      next(error);
    }
  }

  async submitTest(req, res, next) {
    try {
      const { assessmentId } = req.params;
      const { responses } = req.body;
      const realtimeService = req.app.get('realtimeService');
      const result = await aiService.submitTestResponses(assessmentId, responses, realtimeService);
      return ApiResponse.success(res, result, 'Test evaluated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getCareerRecommendations(req, res, next) {
    try {
      const recommendations = await aiService.generateCareerRecommendations(req.user._id);
      return ApiResponse.success(res, recommendations, 'Career recommendations generated');
    } catch (error) {
      next(error);
    }
  }

  async getLearningRoadmap(req, res, next) {
    try {
      const { targetRole } = req.body;
      const roadmap = await aiService.generateLearningRoadmap(req.user._id, targetRole);
      return ApiResponse.success(res, roadmap, 'Learning roadmap generated');
    } catch (error) {
      next(error);
    }
  }

  async getCertifications(req, res, next) {
    try {
      const { targetRole } = req.query;
      const certifications = await aiService.getCertificationRecommendations(req.user._id, targetRole);
      return ApiResponse.success(res, certifications, 'Certification recommendations generated');
    } catch (error) {
      next(error);
    }
  }

  async getSkillProfile(req, res, next) {
    try {
      const profile = await aiService.getUserSkillProfile(req.user._id);
      return ApiResponse.success(res, profile, 'Skill profile retrieved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AIController();
