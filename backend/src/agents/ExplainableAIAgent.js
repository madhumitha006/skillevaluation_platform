const SkillDNA = require('../models/SkillDNA');

class ExplainableAIAgent {
  constructor() {
    this.scoringWeights = {
      technical: 0.4,
      experience: 0.25,
      consistency: 0.15,
      growth: 0.1,
      market_alignment: 0.1
    };

    this.confidenceFactors = {
      data_points: 0.3,
      consistency: 0.25,
      time_span: 0.2,
      validation: 0.25
    };
  }

  async generateExplanation(userId, assessmentId, score) {
    try {
      const skillData = await SkillDNA.find({ user: userId });
      
      const explanation = {
        overallScore: score,
        confidence: this.calculateConfidence(skillData),
        breakdown: this.generateScoreBreakdown(skillData, score),
        reasoning: this.generateReasoning(skillData, score),
        strengths: this.identifyStrengths(skillData),
        weaknesses: this.identifyWeaknesses(skillData),
        recommendations: this.generateRecommendations(skillData),
        weightageDistribution: this.scoringWeights,
        dataQuality: this.assessDataQuality(skillData),
        biasCheck: this.performBiasCheck(skillData)
      };

      return explanation;
    } catch (error) {
      throw new Error(`Explanation generation failed: ${error.message}`);
    }
  }

  generateScoreBreakdown(skillData, totalScore) {
    const breakdown = {
      technical: {
        score: Math.round(totalScore * 0.85),
        weight: this.scoringWeights.technical,
        contribution: Math.round(totalScore * this.scoringWeights.technical),
        factors: ['Code quality', 'Problem solving', 'Technical depth']
      },
      experience: {
        score: Math.round(totalScore * 0.9),
        weight: this.scoringWeights.experience,
        contribution: Math.round(totalScore * this.scoringWeights.experience),
        factors: ['Years of experience', 'Project complexity', 'Domain knowledge']
      },
      consistency: {
        score: Math.round(totalScore * 0.75),
        weight: this.scoringWeights.consistency,
        contribution: Math.round(totalScore * this.scoringWeights.consistency),
        factors: ['Performance stability', 'Answer quality', 'Time management']
      },
      growth: {
        score: Math.round(totalScore * 0.8),
        weight: this.scoringWeights.growth,
        contribution: Math.round(totalScore * this.scoringWeights.growth),
        factors: ['Learning velocity', 'Skill progression', 'Adaptability']
      },
      market_alignment: {
        score: Math.round(totalScore * 0.7),
        weight: this.scoringWeights.market_alignment,
        contribution: Math.round(totalScore * this.scoringWeights.market_alignment),
        factors: ['Industry relevance', 'Trending skills', 'Future demand']
      }
    };

    return breakdown;
  }

  generateReasoning(skillData, score) {
    const reasoning = [];

    if (score >= 85) {
      reasoning.push("Exceptional performance across multiple skill domains");
      reasoning.push("Demonstrates advanced problem-solving capabilities");
    } else if (score >= 70) {
      reasoning.push("Strong foundational skills with room for specialization");
      reasoning.push("Consistent performance with growth potential");
    } else if (score >= 55) {
      reasoning.push("Developing skills with focused improvement areas");
      reasoning.push("Shows promise with targeted skill development");
    } else {
      reasoning.push("Early-stage development with significant growth opportunities");
      reasoning.push("Requires structured learning path and mentorship");
    }

    // Add skill-specific reasoning
    const topSkills = skillData
      .sort((a, b) => b.layers.core.score - a.layers.core.score)
      .slice(0, 3);

    if (topSkills.length > 0) {
      reasoning.push(`Strongest in ${topSkills.map(s => s.skill).join(', ')}`);
    }

    return reasoning;
  }

  identifyStrengths(skillData) {
    return skillData
      .filter(skill => skill.layers.core.score >= 75)
      .sort((a, b) => b.layers.core.score - a.layers.core.score)
      .slice(0, 5)
      .map(skill => ({
        skill: skill.skill,
        score: skill.layers.core.score,
        level: skill.layers.core.level,
        confidence: skill.layers.core.confidence,
        insight: skill.aiInsights.strengthAreas[0] || 'Strong performance demonstrated'
      }));
  }

  identifyWeaknesses(skillData) {
    return skillData
      .filter(skill => skill.layers.core.score < 60)
      .sort((a, b) => a.layers.core.score - b.layers.core.score)
      .slice(0, 5)
      .map(skill => ({
        skill: skill.skill,
        score: skill.layers.core.score,
        level: skill.layers.core.level,
        confidence: skill.layers.core.confidence,
        insight: skill.aiInsights.improvementAreas[0] || 'Requires focused development'
      }));
  }

  generateRecommendations(skillData) {
    const recommendations = [];

    // Skill gap recommendations
    const weakSkills = skillData.filter(skill => skill.layers.core.score < 60);
    if (weakSkills.length > 0) {
      recommendations.push({
        type: 'skill_development',
        priority: 'high',
        title: 'Focus on Core Skill Gaps',
        description: `Prioritize improving ${weakSkills[0].skill} to strengthen foundation`,
        timeframe: '2-3 months',
        resources: ['Online courses', 'Practice projects', 'Mentorship']
      });
    }

    // Market alignment recommendations
    const trendingSkills = skillData.filter(skill => 
      skill.marketDemand.trend === 'rising' && skill.layers.core.score < 70
    );
    if (trendingSkills.length > 0) {
      recommendations.push({
        type: 'market_alignment',
        priority: 'medium',
        title: 'Capitalize on Market Trends',
        description: `${trendingSkills[0].skill} is in high demand - consider specializing`,
        timeframe: '3-6 months',
        resources: ['Industry certifications', 'Real-world projects']
      });
    }

    // Growth recommendations
    const strongSkills = skillData.filter(skill => skill.layers.core.score >= 75);
    if (strongSkills.length > 0) {
      recommendations.push({
        type: 'specialization',
        priority: 'medium',
        title: 'Deepen Expertise',
        description: `Build advanced expertise in ${strongSkills[0].skill}`,
        timeframe: '6-12 months',
        resources: ['Advanced courses', 'Leadership opportunities']
      });
    }

    return recommendations;
  }

  calculateConfidence(skillData) {
    if (skillData.length === 0) return 0.1;

    const dataPoints = Math.min(skillData.length / 10, 1);
    const avgConfidence = skillData.reduce((sum, skill) => 
      sum + skill.layers.core.confidence, 0) / skillData.length;
    const timeSpan = this.calculateTimeSpanFactor(skillData);
    const validation = this.calculateValidationFactor(skillData);

    const confidence = 
      (dataPoints * this.confidenceFactors.data_points) +
      (avgConfidence * this.confidenceFactors.consistency) +
      (timeSpan * this.confidenceFactors.time_span) +
      (validation * this.confidenceFactors.validation);

    return Math.round(confidence * 100) / 100;
  }

  calculateTimeSpanFactor(skillData) {
    const now = new Date();
    const oldestData = skillData.reduce((oldest, skill) => {
      const skillOldest = new Date(skill.createdAt);
      return skillOldest < oldest ? skillOldest : oldest;
    }, now);

    const daysDiff = (now.getTime() - oldestData.getTime()) / (1000 * 60 * 60 * 24);
    return Math.min(daysDiff / 365, 1); // Max factor at 1 year
  }

  calculateValidationFactor(skillData) {
    const validatedSkills = skillData.filter(skill => 
      skill.evolution.length > 2 // Multiple data points
    ).length;
    
    return skillData.length > 0 ? validatedSkills / skillData.length : 0;
  }

  assessDataQuality(skillData) {
    const totalSkills = skillData.length;
    const recentlyUpdated = skillData.filter(skill => {
      const daysSinceUpdate = (new Date() - new Date(skill.lastUpdated)) / (1000 * 60 * 60 * 24);
      return daysSinceUpdate <= 30;
    }).length;

    const withEvolution = skillData.filter(skill => skill.evolution.length > 0).length;
    const withInsights = skillData.filter(skill => skill.aiInsights.strengthAreas.length > 0).length;

    return {
      completeness: totalSkills > 0 ? Math.round((withInsights / totalSkills) * 100) : 0,
      freshness: totalSkills > 0 ? Math.round((recentlyUpdated / totalSkills) * 100) : 0,
      depth: totalSkills > 0 ? Math.round((withEvolution / totalSkills) * 100) : 0,
      overall: totalSkills > 0 ? Math.round(((withInsights + recentlyUpdated + withEvolution) / (totalSkills * 3)) * 100) : 0
    };
  }

  performBiasCheck(skillData) {
    const biasChecks = {
      recency_bias: this.checkRecencyBias(skillData),
      category_bias: this.checkCategoryBias(skillData),
      confidence_bias: this.checkConfidenceBias(skillData),
      overall_risk: 'low'
    };

    const riskFactors = Object.values(biasChecks).filter(check => 
      typeof check === 'object' && check.risk === 'high'
    ).length;

    biasChecks.overall_risk = riskFactors > 1 ? 'high' : riskFactors > 0 ? 'medium' : 'low';

    return biasChecks;
  }

  checkRecencyBias(skillData) {
    const recentAssessments = skillData.filter(skill => {
      const daysSince = (new Date() - new Date(skill.lastUpdated)) / (1000 * 60 * 60 * 24);
      return daysSince <= 7;
    }).length;

    const totalAssessments = skillData.length;
    const recencyRatio = totalAssessments > 0 ? recentAssessments / totalAssessments : 0;

    return {
      detected: recencyRatio > 0.7,
      risk: recencyRatio > 0.7 ? 'medium' : 'low',
      description: recencyRatio > 0.7 ? 
        'High concentration of recent assessments may skew results' : 
        'Balanced temporal distribution of assessments'
    };
  }

  checkCategoryBias(skillData) {
    const categories = {};
    skillData.forEach(skill => {
      categories[skill.category] = (categories[skill.category] || 0) + 1;
    });

    const maxCategory = Math.max(...Object.values(categories));
    const totalSkills = skillData.length;
    const dominanceRatio = totalSkills > 0 ? maxCategory / totalSkills : 0;

    return {
      detected: dominanceRatio > 0.6,
      risk: dominanceRatio > 0.6 ? 'medium' : 'low',
      description: dominanceRatio > 0.6 ? 
        'One skill category dominates the assessment' : 
        'Balanced skill category distribution'
    };
  }

  checkConfidenceBias(skillData) {
    const confidences = skillData.map(skill => skill.layers.core.confidence);
    const avgConfidence = confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;

    return {
      detected: avgConfidence > 0.9 || avgConfidence < 0.3,
      risk: avgConfidence > 0.9 || avgConfidence < 0.3 ? 'medium' : 'low',
      description: avgConfidence > 0.9 ? 
        'Overconfidence detected in AI assessments' : 
        avgConfidence < 0.3 ? 
        'Low confidence may indicate insufficient data' : 
        'Balanced confidence levels'
    };
  }
}

module.exports = new ExplainableAIAgent();