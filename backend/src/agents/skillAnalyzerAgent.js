class SkillAnalyzerAgent {
  constructor() {
    this.skillTaxonomy = {
      technical: {
        programming: ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go', 'Rust'],
        frameworks: ['React', 'Angular', 'Vue', 'Node.js', 'Django', 'Spring', 'Express'],
        databases: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Cassandra'],
        cloud: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes'],
        tools: ['Git', 'Jenkins', 'Terraform', 'Ansible'],
      },
      soft: ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management', 'Critical Thinking'],
    };
  }

  async analyzeResume(resumeText) {
    const extractedSkills = this._extractSkills(resumeText);
    const categorizedSkills = this._categorizeSkills(extractedSkills);
    const proficiencyEstimate = this._estimateProficiency(resumeText, extractedSkills);

    return {
      extractedSkills,
      categorizedSkills,
      proficiencyEstimate,
      totalSkillsFound: extractedSkills.length,
      analysisTimestamp: new Date(),
    };
  }

  _extractSkills(text) {
    const normalizedText = text.toLowerCase();
    const foundSkills = new Set();

    // Extract technical skills
    Object.values(this.skillTaxonomy.technical).flat().forEach((skill) => {
      if (normalizedText.includes(skill.toLowerCase())) {
        foundSkills.add(skill);
      }
    });

    // Extract soft skills
    this.skillTaxonomy.soft.forEach((skill) => {
      if (normalizedText.includes(skill.toLowerCase())) {
        foundSkills.add(skill);
      }
    });

    return Array.from(foundSkills);
  }

  _categorizeSkills(skills) {
    const categorized = {
      technical: { programming: [], frameworks: [], databases: [], cloud: [], tools: [] },
      soft: [],
    };

    skills.forEach((skill) => {
      let categorized_flag = false;

      // Categorize technical skills
      for (const [category, skillList] of Object.entries(this.skillTaxonomy.technical)) {
        if (skillList.includes(skill)) {
          categorized.technical[category].push(skill);
          categorized_flag = true;
          break;
        }
      }

      // Categorize soft skills
      if (!categorized_flag && this.skillTaxonomy.soft.includes(skill)) {
        categorized.soft.push(skill);
      }
    });

    return categorized;
  }

  _estimateProficiency(text, skills) {
    const proficiency = {};
    const normalizedText = text.toLowerCase();

    skills.forEach((skill) => {
      const skillLower = skill.toLowerCase();
      const occurrences = (normalizedText.match(new RegExp(skillLower, 'g')) || []).length;
      
      // Check for experience indicators
      const hasExpert = /expert|advanced|senior|lead/i.test(text);
      const hasIntermediate = /intermediate|proficient|experienced/i.test(text);
      
      let level = 'beginner';
      if (occurrences >= 3 || hasExpert) level = 'expert';
      else if (occurrences >= 2 || hasIntermediate) level = 'intermediate';

      proficiency[skill] = {
        level,
        confidence: Math.min(occurrences * 0.3, 1),
      };
    });

    return proficiency;
  }

  async parseSkillsFromText(text) {
    return this._extractSkills(text);
  }
}

module.exports = new SkillAnalyzerAgent();
