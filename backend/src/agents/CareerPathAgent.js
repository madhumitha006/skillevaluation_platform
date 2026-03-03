const CareerPath = require('../models/CareerPath');
const User = require('../models/User');

class CareerPathAgent {
  constructor() {
    this.careerData = {
      technology: {
        'Junior Developer': { baseSalary: 65000, growth: 0.15, nextRoles: ['Mid-Level Developer', 'Frontend Developer'] },
        'Mid-Level Developer': { baseSalary: 85000, growth: 0.12, nextRoles: ['Senior Developer', 'Tech Lead'] },
        'Senior Developer': { baseSalary: 120000, growth: 0.10, nextRoles: ['Tech Lead', 'Engineering Manager'] },
        'Tech Lead': { baseSalary: 140000, growth: 0.08, nextRoles: ['Engineering Manager', 'Principal Engineer'] },
        'Engineering Manager': { baseSalary: 160000, growth: 0.07, nextRoles: ['Director of Engineering'] },
        'Principal Engineer': { baseSalary: 180000, growth: 0.06, nextRoles: ['Distinguished Engineer'] }
      },
      finance: {
        'Financial Analyst': { baseSalary: 70000, growth: 0.12, nextRoles: ['Senior Analyst', 'Portfolio Manager'] },
        'Senior Analyst': { baseSalary: 95000, growth: 0.10, nextRoles: ['Portfolio Manager', 'VP Finance'] },
        'Portfolio Manager': { baseSalary: 130000, growth: 0.08, nextRoles: ['Senior Portfolio Manager'] },
        'VP Finance': { baseSalary: 180000, growth: 0.06, nextRoles: ['CFO'] }
      }
    };

    this.skillRequirements = {
      'Junior Developer': ['JavaScript', 'HTML/CSS', 'Git', 'Problem Solving'],
      'Mid-Level Developer': ['React/Vue', 'Node.js', 'Database Design', 'Testing', 'Agile'],
      'Senior Developer': ['System Design', 'Microservices', 'Cloud Platforms', 'Mentoring', 'Architecture'],
      'Tech Lead': ['Leadership', 'Project Management', 'Code Review', 'Technical Strategy'],
      'Engineering Manager': ['Team Management', 'Hiring', 'Performance Management', 'Strategic Planning']
    };

    this.certifications = {
      'Junior Developer': [
        { name: 'JavaScript Fundamentals', provider: 'FreeCodeCamp', cost: 0, time: '2 months' },
        { name: 'Git Certification', provider: 'GitHub', cost: 0, time: '1 month' }
      ],
      'Mid-Level Developer': [
        { name: 'React Developer', provider: 'Meta', cost: 299, time: '3 months' },
        { name: 'AWS Cloud Practitioner', provider: 'AWS', cost: 100, time: '2 months' }
      ],
      'Senior Developer': [
        { name: 'AWS Solutions Architect', provider: 'AWS', cost: 150, time: '4 months' },
        { name: 'System Design', provider: 'Educative', cost: 199, time: '3 months' }
      ],
      'Tech Lead': [
        { name: 'Technical Leadership', provider: 'Coursera', cost: 399, time: '2 months' },
        { name: 'Agile Project Management', provider: 'PMI', cost: 500, time: '3 months' }
      ]
    };
  }

  async simulateCareerPath(userId, pathData) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      const simulation = this.generateSimulation(pathData);
      const salaryProgression = this.calculateSalaryProgression(pathData, simulation);
      const milestones = this.generateMilestones(pathData);
      const requiredSkills = this.analyzeSkillGaps(pathData);
      const certifications = this.recommendCertifications(pathData);

      const careerPath = new CareerPath({
        user: userId,
        ...pathData,
        simulationData: simulation,
        salaryProgression,
        milestones,
        requiredSkills,
        certifications,
        lastSimulated: new Date()
      });

      await careerPath.save();
      return careerPath;
    } catch (error) {
      throw new Error(`Career path simulation failed: ${error.message}`);
    }
  }

  generateSimulation(pathData) {
    const { currentRole, targetRole, experienceLevel, industry } = pathData;
    const industryData = this.careerData[industry] || this.careerData.technology;
    
    const currentData = industryData[currentRole] || { baseSalary: 60000, growth: 0.10 };
    const targetData = industryData[targetRole] || { baseSalary: 120000, growth: 0.08 };

    const salaryGap = targetData.baseSalary - currentData.baseSalary;
    const totalGrowthPercentage = Math.round((salaryGap / currentData.baseSalary) * 100);
    const averageYearlyIncrease = Math.round(totalGrowthPercentage / 3);

    // Calculate skill gap score (0-100)
    const currentSkills = this.skillRequirements[currentRole] || [];
    const targetSkills = this.skillRequirements[targetRole] || [];
    const skillGap = targetSkills.filter(skill => !currentSkills.includes(skill));
    const skillGapScore = Math.max(0, 100 - (skillGap.length * 15));

    // Calculate time to target (in years)
    const experienceMultiplier = {
      entry: 1.2,
      mid: 1.0,
      senior: 0.8,
      lead: 0.6
    };
    const baseTime = 3;
    const timeToTarget = Math.round(baseTime * experienceMultiplier[experienceLevel] * 10) / 10;

    // Calculate confidence score
    const confidenceScore = Math.round((skillGapScore * 0.4) + (70 - (timeToTarget * 10)) + 30);

    return {
      totalGrowthPercentage,
      averageYearlyIncrease,
      skillGapScore,
      timeToTarget,
      confidenceScore: Math.max(0, Math.min(100, confidenceScore))
    };
  }

  calculateSalaryProgression(pathData, simulation) {
    const { currentRole, targetRole, industry } = pathData;
    const industryData = this.careerData[industry] || this.careerData.technology;
    
    const currentSalary = industryData[currentRole]?.baseSalary || 60000;
    const targetSalary = industryData[targetRole]?.baseSalary || 120000;
    
    const progression = [];
    const yearlyIncrease = (targetSalary - currentSalary) / 3;

    for (let year = 0; year <= 3; year++) {
      const salary = Math.round(currentSalary + (yearlyIncrease * year));
      const role = year === 0 ? currentRole : 
                   year === 3 ? targetRole : 
                   this.getIntermediateRole(currentRole, targetRole, year);
      
      progression.push({
        year,
        salary,
        role,
        level: this.getRoleLevel(role)
      });
    }

    return progression;
  }

  generateMilestones(pathData) {
    const { currentRole, targetRole } = pathData;
    const milestones = [];

    // Year 1 milestones
    milestones.push({
      year: 1,
      title: 'Foundation Building',
      description: 'Master core skills and gain initial experience',
      requiredSkills: this.skillRequirements[currentRole]?.slice(0, 3) || [],
      certifications: this.certifications[currentRole]?.slice(0, 1).map(c => c.name) || []
    });

    // Year 2 milestones
    const intermediateRole = this.getIntermediateRole(currentRole, targetRole, 2);
    milestones.push({
      year: 2,
      title: 'Skill Advancement',
      description: 'Develop intermediate skills and take on more responsibility',
      requiredSkills: this.skillRequirements[intermediateRole]?.slice(0, 4) || [],
      certifications: this.certifications[intermediateRole]?.slice(0, 1).map(c => c.name) || []
    });

    // Year 3 milestones
    milestones.push({
      year: 3,
      title: 'Target Achievement',
      description: 'Reach target role with advanced expertise',
      requiredSkills: this.skillRequirements[targetRole]?.slice(0, 5) || [],
      certifications: this.certifications[targetRole]?.slice(0, 2).map(c => c.name) || []
    });

    return milestones;
  }

  analyzeSkillGaps(pathData) {
    const { targetRole } = pathData;
    const targetSkills = this.skillRequirements[targetRole] || [];
    
    return targetSkills.map((skill, index) => ({
      skill,
      currentLevel: 'Beginner',
      targetLevel: index < 2 ? 'Expert' : index < 4 ? 'Advanced' : 'Intermediate',
      priority: index < 2 ? 'High' : index < 4 ? 'Medium' : 'Low'
    }));
  }

  recommendCertifications(pathData) {
    const { targetRole } = pathData;
    const certs = this.certifications[targetRole] || [];
    
    return certs.map((cert, index) => ({
      name: cert.name,
      provider: cert.provider,
      estimatedCost: cert.cost,
      timeToComplete: cert.time,
      priority: index === 0 ? 'High' : 'Medium',
      year: index + 1
    }));
  }

  getIntermediateRole(currentRole, targetRole, year) {
    const industryData = this.careerData.technology; // Default to tech
    const currentData = industryData[currentRole];
    
    if (currentData && currentData.nextRoles) {
      const nextRole = currentData.nextRoles.find(role => 
        industryData[role] && industryData[role].baseSalary < industryData[targetRole]?.baseSalary
      );
      return nextRole || currentRole;
    }
    
    return year < 2 ? currentRole : targetRole;
  }

  getRoleLevel(role) {
    if (role.includes('Junior') || role.includes('Analyst')) return 'Entry';
    if (role.includes('Senior') || role.includes('Lead')) return 'Senior';
    if (role.includes('Manager') || role.includes('Director')) return 'Management';
    return 'Mid';
  }

  async compareCareerPaths(userId, pathIds) {
    try {
      const paths = await CareerPath.find({
        _id: { $in: pathIds },
        user: userId
      });

      const comparison = paths.map(path => ({
        id: path._id,
        name: path.pathName,
        targetRole: path.targetRole,
        timeToTarget: path.simulationData.timeToTarget,
        salaryGrowth: path.simulationData.totalGrowthPercentage,
        confidenceScore: path.simulationData.confidenceScore,
        finalSalary: path.salaryProgression[path.salaryProgression.length - 1]?.salary,
        skillsRequired: path.requiredSkills.length,
        certificationsNeeded: path.certifications.length
      }));

      return {
        paths: comparison,
        recommendations: this.generateComparisonRecommendations(comparison)
      };
    } catch (error) {
      throw new Error(`Career path comparison failed: ${error.message}`);
    }
  }

  generateComparisonRecommendations(comparison) {
    const recommendations = [];
    
    // Find highest salary path
    const highestSalary = comparison.reduce((max, path) => 
      path.finalSalary > max.finalSalary ? path : max
    );
    recommendations.push(`${highestSalary.name} offers the highest salary potential`);

    // Find fastest path
    const fastest = comparison.reduce((min, path) => 
      path.timeToTarget < min.timeToTarget ? path : min
    );
    recommendations.push(`${fastest.name} is the quickest path to achieve`);

    // Find most confident path
    const mostConfident = comparison.reduce((max, path) => 
      path.confidenceScore > max.confidenceScore ? path : max
    );
    recommendations.push(`${mostConfident.name} has the highest success probability`);

    return recommendations;
  }

  async getUserCareerPaths(userId) {
    try {
      return await CareerPath.find({ user: userId, isActive: true })
        .sort({ createdAt: -1 })
        .select('pathName targetRole simulationData salaryProgression createdAt');
    } catch (error) {
      throw new Error(`Failed to get user career paths: ${error.message}`);
    }
  }
}

module.exports = new CareerPathAgent();