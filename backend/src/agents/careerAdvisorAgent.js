class CareerAdvisorAgent {
  constructor() {
    this.careerPaths = {
      'Frontend Developer': {
        requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'TypeScript'],
        optionalSkills: ['Vue', 'Angular', 'Webpack'],
        certifications: ['AWS Certified Developer', 'Google Mobile Web Specialist'],
        averageSalary: '$85,000 - $120,000',
      },
      'Backend Developer': {
        requiredSkills: ['Node.js', 'Python', 'Java', 'MongoDB', 'PostgreSQL'],
        optionalSkills: ['Redis', 'Kafka', 'Docker'],
        certifications: ['AWS Certified Solutions Architect', 'Oracle Java Certification'],
        averageSalary: '$90,000 - $130,000',
      },
      'Full Stack Developer': {
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
        optionalSkills: ['Docker', 'Kubernetes', 'AWS'],
        certifications: ['AWS Certified Developer', 'MongoDB Certified Developer'],
        averageSalary: '$95,000 - $140,000',
      },
      'DevOps Engineer': {
        requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform'],
        optionalSkills: ['Ansible', 'Python', 'Go'],
        certifications: ['AWS Certified DevOps Engineer', 'Kubernetes Administrator'],
        averageSalary: '$100,000 - $150,000',
      },
      'Data Scientist': {
        requiredSkills: ['Python', 'Machine Learning', 'Statistics', 'SQL'],
        optionalSkills: ['TensorFlow', 'PyTorch', 'R'],
        certifications: ['Google Data Analytics', 'IBM Data Science Professional'],
        averageSalary: '$110,000 - $160,000',
      },
    };

    this.learningResources = {
      JavaScript: ['freeCodeCamp', 'JavaScript.info', 'MDN Web Docs'],
      React: ['React Official Docs', 'Scrimba React Course', 'Epic React'],
      Python: ['Python.org Tutorial', 'Real Python', 'Automate the Boring Stuff'],
      'Node.js': ['Node.js Docs', 'NodeSchool', 'The Net Ninja'],
      AWS: ['AWS Training', 'A Cloud Guru', 'AWS Certified Solutions Architect'],
    };
  }

  async generateLearningRoadmap(userSkills, targetRole) {
    const roleRequirements = this.careerPaths[targetRole];
    if (!roleRequirements) {
      return { error: 'Target role not found' };
    }

    const skillGaps = this._identifySkillGaps(userSkills, roleRequirements);
    const roadmap = this._createRoadmap(skillGaps);
    const timeline = this._estimateTimeline(skillGaps);

    return {
      targetRole,
      currentSkills: userSkills,
      skillGaps,
      roadmap,
      timeline,
      estimatedCompletion: `${timeline.totalWeeks} weeks`,
    };
  }

  async recommendCareerPaths(userSkills, strengths) {
    const recommendations = [];

    for (const [role, requirements] of Object.entries(this.careerPaths)) {
      const matchScore = this._calculateMatchScore(userSkills, requirements.requiredSkills);
      const strengthAlignment = this._alignWithStrengths(strengths, requirements.requiredSkills);

      if (matchScore >= 0.3) {
        recommendations.push({
          role,
          matchScore: Math.round(matchScore * 100),
          strengthAlignment: Math.round(strengthAlignment * 100),
          missingSkills: requirements.requiredSkills.filter(s => !userSkills.includes(s)),
          salary: requirements.averageSalary,
          priority: matchScore >= 0.7 ? 'high' : matchScore >= 0.5 ? 'medium' : 'low',
        });
      }
    }

    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }

  async suggestCertifications(userSkills, targetRole) {
    const roleRequirements = this.careerPaths[targetRole];
    if (!roleRequirements) {
      return [];
    }

    const relevantCerts = roleRequirements.certifications.map(cert => ({
      name: cert,
      relevance: this._calculateCertRelevance(cert, userSkills),
      estimatedPreparationTime: '4-8 weeks',
    }));

    return relevantCerts.sort((a, b) => b.relevance - a.relevance);
  }

  _identifySkillGaps(userSkills, roleRequirements) {
    const required = roleRequirements.requiredSkills.filter(s => !userSkills.includes(s));
    const optional = roleRequirements.optionalSkills.filter(s => !userSkills.includes(s));

    return {
      critical: required,
      recommended: optional,
      totalGaps: required.length + optional.length,
    };
  }

  _createRoadmap(skillGaps) {
    const phases = [];

    if (skillGaps.critical.length > 0) {
      phases.push({
        phase: 1,
        title: 'Foundation Skills',
        skills: skillGaps.critical.slice(0, 3),
        duration: '4-6 weeks',
        resources: skillGaps.critical.slice(0, 3).map(s => ({
          skill: s,
          resources: this.learningResources[s] || ['Online tutorials', 'Documentation'],
        })),
      });
    }

    if (skillGaps.critical.length > 3) {
      phases.push({
        phase: 2,
        title: 'Advanced Skills',
        skills: skillGaps.critical.slice(3),
        duration: '4-6 weeks',
        resources: skillGaps.critical.slice(3).map(s => ({
          skill: s,
          resources: this.learningResources[s] || ['Online tutorials', 'Documentation'],
        })),
      });
    }

    if (skillGaps.recommended.length > 0) {
      phases.push({
        phase: phases.length + 1,
        title: 'Optional Enhancements',
        skills: skillGaps.recommended,
        duration: '2-4 weeks',
        resources: skillGaps.recommended.map(s => ({
          skill: s,
          resources: this.learningResources[s] || ['Online tutorials', 'Documentation'],
        })),
      });
    }

    return phases;
  }

  _estimateTimeline(skillGaps) {
    const weeksPerSkill = 2;
    const criticalWeeks = skillGaps.critical.length * weeksPerSkill;
    const optionalWeeks = skillGaps.recommended.length * 1;

    return {
      criticalSkills: `${criticalWeeks} weeks`,
      optionalSkills: `${optionalWeeks} weeks`,
      totalWeeks: criticalWeeks + optionalWeeks,
    };
  }

  _calculateMatchScore(userSkills, requiredSkills) {
    if (requiredSkills.length === 0) return 0;
    const matches = requiredSkills.filter(s => userSkills.includes(s)).length;
    return matches / requiredSkills.length;
  }

  _alignWithStrengths(strengths, requiredSkills) {
    if (!strengths || strengths.length === 0) return 0;
    const strengthSkills = strengths.map(s => s.skill);
    const matches = requiredSkills.filter(s => strengthSkills.includes(s)).length;
    return requiredSkills.length > 0 ? matches / requiredSkills.length : 0;
  }

  _calculateCertRelevance(cert, userSkills) {
    // Simplified relevance calculation
    const certKeywords = cert.toLowerCase().split(' ');
    const matches = certKeywords.filter(kw => 
      userSkills.some(skill => skill.toLowerCase().includes(kw))
    ).length;
    return Math.min(matches / certKeywords.length, 1);
  }
}

module.exports = new CareerAdvisorAgent();
