const Portfolio = require('../models/Portfolio');
const User = require('../models/User');

class PortfolioAgent {
  constructor() {
    this.bioTemplates = {
      technical: "Experienced {title} with {experience} years in {topSkills}. Passionate about {interests} and delivering high-quality solutions.",
      creative: "Creative {title} specializing in {topSkills}. I bring {experience} years of experience creating innovative solutions and driving results.",
      leadership: "Results-driven {title} with {experience} years of leadership experience. Expert in {topSkills} with a track record of {achievements}.",
      academic: "Dedicated {title} with strong expertise in {topSkills}. {experience} years of experience in research and development."
    };
  }

  async generateAIBio(userId) {
    try {
      const portfolio = await Portfolio.findOne({ user: userId }).populate('user');
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      const user = portfolio.user;
      const skills = portfolio.skills.slice(0, 3).map(s => s.name);
      const topSkills = skills.join(', ');
      const experience = this.calculateExperience(portfolio.experience);
      const title = portfolio.personalInfo.title || 'Professional';

      // Simple AI bio generation (in production, use OpenAI API)
      const template = this.selectBioTemplate(portfolio);
      const aiGeneratedBio = template
        .replace('{title}', title)
        .replace('{experience}', experience)
        .replace('{topSkills}', topSkills)
        .replace('{interests}', this.extractInterests(portfolio))
        .replace('{achievements}', this.summarizeAchievements(portfolio));

      await Portfolio.findOneAndUpdate(
        { user: userId },
        { 'personalInfo.aiGeneratedBio': aiGeneratedBio }
      );

      return aiGeneratedBio;
    } catch (error) {
      throw new Error(`AI bio generation failed: ${error.message}`);
    }
  }

  selectBioTemplate(portfolio) {
    const skillCategories = portfolio.skills.map(s => s.category);
    const hasLeadership = portfolio.experience.some(exp => 
      exp.position?.toLowerCase().includes('lead') || 
      exp.position?.toLowerCase().includes('manager')
    );

    if (hasLeadership) return this.bioTemplates.leadership;
    if (skillCategories.includes('Technical')) return this.bioTemplates.technical;
    return this.bioTemplates.creative;
  }

  calculateExperience(experiences) {
    if (!experiences.length) return '2+';
    
    const totalMonths = experiences.reduce((total, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.isCurrent ? new Date() : new Date(exp.endDate);
      const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                    (end.getMonth() - start.getMonth());
      return total + months;
    }, 0);

    const years = Math.floor(totalMonths / 12);
    return years > 0 ? `${years}+` : '1+';
  }

  extractInterests(portfolio) {
    const interests = portfolio.skills
      .filter(s => s.category === 'Technical')
      .slice(0, 2)
      .map(s => s.name.toLowerCase());
    return interests.join(' and ') || 'technology';
  }

  summarizeAchievements(portfolio) {
    if (portfolio.achievements.length === 0) return 'delivering successful projects';
    
    const achievementTypes = portfolio.achievements.map(a => a.type.toLowerCase());
    const unique = [...new Set(achievementTypes)];
    return unique.slice(0, 2).join(' and ') || 'professional excellence';
  }

  async optimizePortfolioSEO(portfolioId) {
    try {
      const portfolio = await Portfolio.findById(portfolioId);
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      const skills = portfolio.skills.map(s => s.name);
      const title = portfolio.personalInfo.title || 'Professional';
      const name = portfolio.personalInfo.displayName || 'Professional';

      const seoSettings = {
        metaTitle: `${name} - ${title} | SkillNexus Portfolio`,
        metaDescription: `${name} is a ${title} specializing in ${skills.slice(0, 3).join(', ')}. View portfolio, skills, and achievements.`,
        keywords: [...skills, title, name, 'portfolio', 'skills', 'professional']
      };

      await Portfolio.findByIdAndUpdate(portfolioId, { seoSettings });
      return seoSettings;
    } catch (error) {
      throw new Error(`SEO optimization failed: ${error.message}`);
    }
  }

  async generateSkillInsights(userId) {
    try {
      const portfolio = await Portfolio.findOne({ user: userId });
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      const skills = portfolio.skills;
      const categories = {};
      
      skills.forEach(skill => {
        if (!categories[skill.category]) {
          categories[skill.category] = [];
        }
        categories[skill.category].push(skill);
      });

      const insights = {
        totalSkills: skills.length,
        strongestCategory: this.findStrongestCategory(categories),
        averageScore: this.calculateAverageScore(skills),
        recommendations: this.generateSkillRecommendations(skills),
        radarData: this.generateRadarData(categories)
      };

      return insights;
    } catch (error) {
      throw new Error(`Skill insights generation failed: ${error.message}`);
    }
  }

  findStrongestCategory(categories) {
    let strongest = { category: '', avgScore: 0 };
    
    Object.entries(categories).forEach(([category, skills]) => {
      const avgScore = skills.reduce((sum, skill) => sum + skill.score, 0) / skills.length;
      if (avgScore > strongest.avgScore) {
        strongest = { category, avgScore };
      }
    });

    return strongest;
  }

  calculateAverageScore(skills) {
    if (skills.length === 0) return 0;
    return Math.round(skills.reduce((sum, skill) => sum + skill.score, 0) / skills.length);
  }

  generateSkillRecommendations(skills) {
    const recommendations = [];
    
    // Find skills with low scores
    const weakSkills = skills.filter(s => s.score < 60);
    if (weakSkills.length > 0) {
      recommendations.push(`Consider improving ${weakSkills[0].name} to strengthen your profile`);
    }

    // Suggest complementary skills
    const hasReact = skills.some(s => s.name.toLowerCase().includes('react'));
    const hasNode = skills.some(s => s.name.toLowerCase().includes('node'));
    
    if (hasReact && !hasNode) {
      recommendations.push('Consider adding Node.js to complement your React skills');
    }

    return recommendations.slice(0, 3);
  }

  generateRadarData(categories) {
    return Object.entries(categories).map(([category, skills]) => ({
      category,
      score: Math.round(skills.reduce((sum, skill) => sum + skill.score, 0) / skills.length),
      fullMark: 100
    }));
  }
}

module.exports = new PortfolioAgent();