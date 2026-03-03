const JobRole = require('../models/JobRole');
const JobMatch = require('../models/JobMatch');
const User = require('../models/User');
const Company = require('../models/Company');

class JobMatchingAgent {
  constructor() {
    this.skillLevelWeights = {
      'None': 0,
      'Beginner': 1,
      'Intermediate': 2,
      'Advanced': 3,
      'Expert': 4
    };
  }

  async calculateJobMatch(userId, jobRoleId) {
    try {
      const user = await User.findById(userId);
      const jobRole = await JobRole.findById(jobRoleId).populate('postedBy');

      if (!user || !jobRole) {
        throw new Error('User or Job Role not found');
      }

      // Ensure job belongs to user's company context or is public
      if (user.company && jobRole.postedBy.company && 
          user.company.toString() !== jobRole.postedBy.company.toString()) {
        throw new Error('Access denied to this job role');
      }

      const userSkills = this.normalizeUserSkills(user.skills || []);
      const matchResult = this.calculateMatchScore(userSkills, jobRole.skillRequirements);

      // Save or update match result
      const jobMatch = await JobMatch.findOneAndUpdate(
        { user: userId, jobRole: jobRoleId },
        {
          matchScore: matchResult.score,
          skillGaps: matchResult.skillGaps,
          matchedSkills: matchResult.matchedSkills,
          recommendations: matchResult.recommendations
        },
        { upsert: true, new: true }
      );

      return jobMatch;
    } catch (error) {
      throw new Error(`Job matching failed: ${error.message}`);
    }
  }

  calculateMatchScore(userSkills, jobRequirements) {
    let totalWeight = 0;
    let achievedScore = 0;
    const skillGaps = [];
    const matchedSkills = [];
    const recommendations = [];

    for (const requirement of jobRequirements) {
      totalWeight += requirement.weight;
      const userSkill = userSkills[requirement.skill.toLowerCase()];
      const userLevel = userSkill ? userSkill.level : 'None';
      const requiredLevel = requirement.level;

      const userLevelWeight = this.skillLevelWeights[userLevel];
      const requiredLevelWeight = this.skillLevelWeights[requiredLevel];

      if (userLevelWeight >= requiredLevelWeight) {
        // Skill requirement met
        achievedScore += requirement.weight;
        matchedSkills.push({
          skill: requirement.skill,
          userLevel,
          requiredLevel,
          score: requirement.weight
        });
      } else {
        // Skill gap identified
        const gap = requiredLevelWeight - userLevelWeight;
        skillGaps.push({
          skill: requirement.skill,
          requiredLevel,
          currentLevel: userLevel,
          gap,
          weight: requirement.weight
        });

        // Partial credit for lower levels
        const partialScore = (userLevelWeight / requiredLevelWeight) * requirement.weight;
        achievedScore += partialScore;

        matchedSkills.push({
          skill: requirement.skill,
          userLevel,
          requiredLevel,
          score: partialScore
        });
      }
    }

    const matchScore = totalWeight > 0 ? Math.round((achievedScore / totalWeight) * 100) : 0;

    // Generate recommendations
    if (skillGaps.length > 0) {
      const topGaps = skillGaps
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 3)
        .map(gap => `Improve ${gap.skill} to ${gap.requiredLevel} level`);
      recommendations.push(...topGaps);
    }

    return {
      score: matchScore,
      skillGaps,
      matchedSkills,
      recommendations
    };
  }

  normalizeUserSkills(skills) {
    const normalized = {};
    skills.forEach(skill => {
      normalized[skill.name.toLowerCase()] = {
        level: skill.level || 'Beginner',
        experience: skill.experience || 0
      };
    });
    return normalized;
  }

  async findMatchingJobs(userId, limit = 10) {
    try {
      const activeJobs = await JobRole.find({ isActive: true }).lean();
      const matches = [];

      for (const job of activeJobs) {
        const matchResult = await this.calculateJobMatch(userId, job._id);
        matches.push({
          ...job,
          matchScore: matchResult.matchScore,
          skillGaps: matchResult.skillGaps,
          recommendations: matchResult.recommendations
        });
      }

      return matches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
    } catch (error) {
      throw new Error(`Finding matching jobs failed: ${error.message}`);
    }
  }

  async getJobMatchDetails(userId, jobRoleId) {
    try {
      const jobMatch = await JobMatch.findOne({ user: userId, jobRole: jobRoleId })
        .populate('jobRole')
        .populate('user', 'name email skills');

      if (!jobMatch) {
        // Calculate match if not exists
        return await this.calculateJobMatch(userId, jobRoleId);
      }

      return jobMatch;
    } catch (error) {
      throw new Error(`Getting job match details failed: ${error.message}`);
    }
  }

  async getSkillGapAnalysis(userId) {
    try {
      const matches = await JobMatch.find({ user: userId })
        .populate('jobRole', 'title company')
        .sort({ matchScore: -1 });

      const skillGapFrequency = {};
      const recommendations = new Set();

      matches.forEach(match => {
        match.skillGaps.forEach(gap => {
          if (!skillGapFrequency[gap.skill]) {
            skillGapFrequency[gap.skill] = {
              skill: gap.skill,
              frequency: 0,
              totalWeight: 0,
              levels: new Set()
            };
          }
          skillGapFrequency[gap.skill].frequency++;
          skillGapFrequency[gap.skill].totalWeight += gap.weight;
          skillGapFrequency[gap.skill].levels.add(gap.requiredLevel);
        });

        match.recommendations.forEach(rec => recommendations.add(rec));
      });

      const prioritizedSkills = Object.values(skillGapFrequency)
        .sort((a, b) => (b.frequency * b.totalWeight) - (a.frequency * a.totalWeight))
        .slice(0, 10);

      return {
        prioritizedSkills,
        recommendations: Array.from(recommendations).slice(0, 5),
        totalJobsAnalyzed: matches.length
      };
    } catch (error) {
      throw new Error(`Skill gap analysis failed: ${error.message}`);
    }
  }
}

module.exports = new JobMatchingAgent();