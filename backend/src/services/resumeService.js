const skillAnalyzerAgent = require('../agents/skillAnalyzerAgent');
const fileParser = require('../utils/fileParser');
const SkillProfile = require('../models/SkillProfile');
const AppError = require('../utils/AppError');

class ResumeService {
  async uploadAndAnalyze(userId, file) {
    if (!file) {
      throw new AppError('No file uploaded', 400);
    }

    try {
      // Parse file to extract text
      const resumeText = await fileParser.parseFile(file.path);

      // Analyze resume using AI agent
      const analysis = await skillAnalyzerAgent.analyzeResume(resumeText);

      // Save to database
      const skillProfile = await SkillProfile.findOneAndUpdate(
        { userId },
        {
          userId,
          resumeText,
          extractedSkills: analysis.extractedSkills,
          categorizedSkills: analysis.categorizedSkills,
          proficiencyLevels: analysis.proficiencyEstimate,
          lastAnalyzedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      // Delete uploaded file after processing
      await fileParser.deleteFile(file.path);

      return {
        profile: skillProfile,
        analysis: {
          ...analysis,
          summary: this._generateSummary(analysis),
        },
        fileName: file.originalname,
      };
    } catch (error) {
      // Clean up file on error
      if (file && file.path) {
        await fileParser.deleteFile(file.path);
      }
      throw error;
    }
  }

  async getSkillProfile(userId) {
    const profile = await SkillProfile.findOne({ userId });
    if (!profile) {
      throw new AppError('No skill profile found. Please upload your resume first.', 404);
    }
    return profile;
  }

  _generateSummary(analysis) {
    const totalSkills = analysis.extractedSkills.length;
    const technicalSkills = Object.values(analysis.categorizedSkills.technical).flat().length;
    const softSkills = analysis.categorizedSkills.soft.length;

    const expertSkills = Object.entries(analysis.proficiencyEstimate)
      .filter(([_, data]) => data.level === 'expert')
      .map(([skill]) => skill);

    return {
      totalSkills,
      technicalSkills,
      softSkills,
      expertSkills,
      topCategories: this._getTopCategories(analysis.categorizedSkills),
      overallLevel: this._calculateOverallLevel(analysis.proficiencyEstimate),
    };
  }

  _getTopCategories(categorizedSkills) {
    const categories = [];
    
    Object.entries(categorizedSkills.technical).forEach(([category, skills]) => {
      if (skills.length > 0) {
        categories.push({ name: category, count: skills.length });
      }
    });

    if (categorizedSkills.soft.length > 0) {
      categories.push({ name: 'soft skills', count: categorizedSkills.soft.length });
    }

    return categories.sort((a, b) => b.count - a.count).slice(0, 3);
  }

  _calculateOverallLevel(proficiencyEstimate) {
    const levels = Object.values(proficiencyEstimate).map(p => p.level);
    const expertCount = levels.filter(l => l === 'expert').length;
    const intermediateCount = levels.filter(l => l === 'intermediate').length;

    if (expertCount > levels.length / 2) return 'Expert';
    if (intermediateCount + expertCount > levels.length / 2) return 'Intermediate';
    return 'Beginner';
  }
}

module.exports = new ResumeService();
