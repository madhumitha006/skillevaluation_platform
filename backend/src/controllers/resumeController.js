const resumeService = require('../services/resumeService');
const ApiResponse = require('../utils/ApiResponse');

class ResumeController {
  async uploadResume(req, res, next) {
    try {
      const result = await resumeService.uploadAndAnalyze(req.user._id, req.file);
      return ApiResponse.success(res, result, 'Resume analyzed successfully');
    } catch (error) {
      next(error);
    }
  }

  async getSkillProfile(req, res, next) {
    try {
      const profile = await resumeService.getSkillProfile(req.user._id);
      return ApiResponse.success(res, profile, 'Skill profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ResumeController();
