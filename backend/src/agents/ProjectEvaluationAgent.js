const ProjectEvaluation = require('../models/ProjectEvaluation');
const axios = require('axios');

class ProjectEvaluationAgent {
  constructor() {
    this.evaluationCriteria = {
      codeQuality: { weight: 0.3, name: 'Code Quality' },
      documentation: { weight: 0.2, name: 'Documentation' },
      structure: { weight: 0.25, name: 'Project Structure' },
      scalability: { weight: 0.15, name: 'Scalability' },
      innovation: { weight: 0.1, name: 'Innovation' }
    };

    this.technologyPatterns = {
      web: ['react', 'vue', 'angular', 'html', 'css', 'javascript', 'typescript'],
      mobile: ['react-native', 'flutter', 'swift', 'kotlin', 'ionic'],
      backend: ['node', 'express', 'django', 'flask', 'spring', 'laravel'],
      database: ['mongodb', 'mysql', 'postgresql', 'redis', 'sqlite'],
      cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes']
    };
  }

  async evaluateProject(projectData) {
    try {
      const startTime = Date.now();
      
      // Create evaluation record
      const evaluation = new ProjectEvaluation({
        ...projectData,
        evaluationStatus: 'analyzing'
      });
      await evaluation.save();

      // Perform AI analysis
      const analysis = await this.performAIAnalysis(projectData);
      
      // Calculate scores
      const scores = this.calculateScores(analysis);
      const overallScore = this.calculateOverallScore(scores);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(analysis, scores);
      
      // Update evaluation with results
      evaluation.overallScore = overallScore;
      evaluation.evaluationCriteria = this.formatEvaluationCriteria(scores);
      evaluation.aiAnalysis = analysis;
      evaluation.strengths = this.identifyStrengths(scores);
      evaluation.weaknesses = this.identifyWeaknesses(scores);
      evaluation.recommendations = recommendations;
      evaluation.evaluationStatus = 'completed';
      evaluation.evaluatedAt = new Date();
      evaluation.processingTime = Math.round((Date.now() - startTime) / 1000);

      await evaluation.save();
      return evaluation;
    } catch (error) {
      throw new Error(`Project evaluation failed: ${error.message}`);
    }
  }

  async performAIAnalysis(projectData) {
    // Simulate AI analysis (in production, integrate with actual AI services)
    const analysis = {
      codeQuality: await this.analyzeCodeQuality(projectData),
      documentation: await this.analyzeDocumentation(projectData),
      structure: await this.analyzeStructure(projectData),
      scalability: await this.analyzeScalability(projectData)
    };

    return analysis;
  }

  async analyzeCodeQuality(projectData) {
    const issues = [];
    const suggestions = [];
    let score = 85; // Base score

    // Analyze description for code quality indicators
    const description = projectData.description.toLowerCase();
    
    if (description.includes('test')) {
      score += 10;
      suggestions.push('Great job including tests in your project');
    } else {
      score -= 15;
      issues.push('No mention of testing in project description');
      suggestions.push('Add unit tests to improve code reliability');
    }

    if (description.includes('typescript')) {
      score += 5;
      suggestions.push('TypeScript usage shows good type safety practices');
    }

    if (description.includes('eslint') || description.includes('prettier')) {
      score += 5;
      suggestions.push('Code formatting tools indicate good development practices');
    }

    // GitHub URL analysis
    if (projectData.githubUrl) {
      score += 5;
      suggestions.push('GitHub repository shows good version control practices');
    } else {
      score -= 10;
      issues.push('No GitHub repository provided for code review');
      suggestions.push('Consider hosting your code on GitHub for better visibility');
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      issues,
      suggestions
    };
  }

  async analyzeDocumentation(projectData) {
    const suggestions = [];
    let score = 70; // Base score
    let coverage = 'Basic';

    const description = projectData.description.toLowerCase();
    const hasReadme = description.includes('readme') || description.includes('documentation');
    const hasComments = description.includes('comment') || description.includes('documented');
    const hasApi = description.includes('api') && description.includes('doc');

    if (hasReadme) {
      score += 15;
      coverage = 'Good';
      suggestions.push('README documentation is present');
    } else {
      suggestions.push('Add a comprehensive README file');
    }

    if (hasComments) {
      score += 10;
      suggestions.push('Code comments improve maintainability');
    } else {
      suggestions.push('Add inline comments for complex logic');
    }

    if (hasApi) {
      score += 10;
      coverage = 'Excellent';
      suggestions.push('API documentation enhances usability');
    }

    if (score >= 85) coverage = 'Excellent';
    else if (score >= 75) coverage = 'Good';
    else if (score >= 60) coverage = 'Basic';
    else coverage = 'Poor';

    return {
      score: Math.max(0, Math.min(100, score)),
      coverage,
      suggestions
    };
  }

  async analyzeStructure(projectData) {
    const patterns = [];
    const suggestions = [];
    let score = 75; // Base score

    const description = projectData.description.toLowerCase();
    const technologies = projectData.technologies || [];

    // Check for modern frameworks
    const modernFrameworks = ['react', 'vue', 'angular', 'next', 'nuxt'];
    const hasModernFramework = technologies.some(tech => 
      modernFrameworks.some(framework => tech.toLowerCase().includes(framework))
    );

    if (hasModernFramework) {
      score += 10;
      patterns.push('Modern framework usage');
      suggestions.push('Good choice of modern development framework');
    }

    // Check for architectural patterns
    if (description.includes('mvc') || description.includes('mvvm')) {
      score += 10;
      patterns.push('Architectural pattern implementation');
      suggestions.push('Clear architectural pattern improves maintainability');
    }

    if (description.includes('component') || description.includes('modular')) {
      score += 8;
      patterns.push('Component-based architecture');
      suggestions.push('Modular design enhances code reusability');
    }

    if (description.includes('api') && description.includes('separate')) {
      score += 7;
      patterns.push('API separation');
      suggestions.push('Separated API layer shows good architecture');
    }

    // Check for build tools
    if (technologies.some(tech => ['webpack', 'vite', 'rollup'].includes(tech.toLowerCase()))) {
      score += 5;
      patterns.push('Modern build tools');
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      patterns,
      suggestions
    };
  }

  async analyzeScalability(projectData) {
    const concerns = [];
    const suggestions = [];
    let score = 70; // Base score

    const description = projectData.description.toLowerCase();
    const technologies = projectData.technologies || [];

    // Check for scalability indicators
    if (description.includes('database') || technologies.some(tech => 
      ['mongodb', 'postgresql', 'mysql'].includes(tech.toLowerCase())
    )) {
      score += 10;
      suggestions.push('Database integration supports data scalability');
    } else {
      concerns.push('No database mentioned for data persistence');
      suggestions.push('Consider adding a database for better data management');
    }

    if (description.includes('cache') || description.includes('redis')) {
      score += 8;
      suggestions.push('Caching strategy improves performance at scale');
    }

    if (description.includes('microservice') || description.includes('api')) {
      score += 10;
      suggestions.push('Service-oriented architecture supports scalability');
    }

    if (technologies.some(tech => ['docker', 'kubernetes'].includes(tech.toLowerCase()))) {
      score += 12;
      suggestions.push('Containerization enables easy scaling');
    }

    if (description.includes('cloud') || technologies.some(tech => 
      ['aws', 'azure', 'gcp'].includes(tech.toLowerCase())
    )) {
      score += 8;
      suggestions.push('Cloud deployment supports horizontal scaling');
    } else {
      concerns.push('No cloud deployment strategy mentioned');
      suggestions.push('Consider cloud deployment for better scalability');
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      concerns,
      suggestions
    };
  }

  calculateScores(analysis) {
    return {
      codeQuality: analysis.codeQuality.score,
      documentation: analysis.documentation.score,
      structure: analysis.structure.score,
      scalability: analysis.scalability.score,
      innovation: this.calculateInnovationScore(analysis)
    };
  }

  calculateInnovationScore(analysis) {
    // Simple innovation scoring based on technology usage and features
    let score = 60;
    
    if (analysis.structure.patterns.length > 2) score += 15;
    if (analysis.codeQuality.suggestions.some(s => s.includes('TypeScript'))) score += 10;
    if (analysis.scalability.suggestions.some(s => s.includes('microservice'))) score += 15;
    
    return Math.max(0, Math.min(100, score));
  }

  calculateOverallScore(scores) {
    let weightedScore = 0;
    
    Object.entries(this.evaluationCriteria).forEach(([key, criteria]) => {
      weightedScore += scores[key] * criteria.weight;
    });

    return Math.round(weightedScore);
  }

  formatEvaluationCriteria(scores) {
    return Object.entries(this.evaluationCriteria).map(([key, criteria]) => ({
      name: criteria.name,
      score: scores[key],
      weight: criteria.weight,
      feedback: this.generateCriteriaFeedback(key, scores[key]),
      suggestions: this.generateCriteriaSuggestions(key, scores[key])
    }));
  }

  generateCriteriaFeedback(criteria, score) {
    const feedbackMap = {
      codeQuality: {
        excellent: 'Exceptional code quality with best practices',
        good: 'Good code quality with room for minor improvements',
        average: 'Average code quality, several areas need attention',
        poor: 'Code quality needs significant improvement'
      },
      documentation: {
        excellent: 'Comprehensive documentation covering all aspects',
        good: 'Good documentation with minor gaps',
        average: 'Basic documentation present but incomplete',
        poor: 'Documentation is insufficient or missing'
      },
      structure: {
        excellent: 'Excellent project structure following best practices',
        good: 'Well-organized structure with good patterns',
        average: 'Decent structure but could be better organized',
        poor: 'Poor structure affecting maintainability'
      },
      scalability: {
        excellent: 'Highly scalable architecture ready for growth',
        good: 'Good scalability considerations implemented',
        average: 'Some scalability features but needs improvement',
        poor: 'Limited scalability, major refactoring needed'
      },
      innovation: {
        excellent: 'Highly innovative approach with cutting-edge solutions',
        good: 'Good use of modern technologies and patterns',
        average: 'Standard implementation with some modern features',
        poor: 'Traditional approach, lacks innovation'
      }
    };

    const level = score >= 85 ? 'excellent' : score >= 75 ? 'good' : score >= 60 ? 'average' : 'poor';
    return feedbackMap[criteria]?.[level] || 'No feedback available';
  }

  generateCriteriaSuggestions(criteria, score) {
    const suggestionMap = {
      codeQuality: score < 80 ? ['Add unit tests', 'Implement code linting', 'Use TypeScript for type safety'] : ['Consider advanced testing strategies'],
      documentation: score < 80 ? ['Add comprehensive README', 'Document API endpoints', 'Include code comments'] : ['Consider adding video tutorials'],
      structure: score < 80 ? ['Implement design patterns', 'Organize code into modules', 'Separate concerns properly'] : ['Explore advanced architectural patterns'],
      scalability: score < 80 ? ['Add database layer', 'Implement caching', 'Consider microservices'] : ['Optimize for high availability'],
      innovation: score < 80 ? ['Explore modern frameworks', 'Implement CI/CD', 'Add real-time features'] : ['Consider emerging technologies']
    };

    return suggestionMap[criteria] || [];
  }

  identifyStrengths(scores) {
    const strengths = [];
    Object.entries(scores).forEach(([key, score]) => {
      if (score >= 80) {
        strengths.push(`Strong ${this.evaluationCriteria[key]?.name || key}`);
      }
    });
    return strengths.length > 0 ? strengths : ['Project shows potential for improvement'];
  }

  identifyWeaknesses(scores) {
    const weaknesses = [];
    Object.entries(scores).forEach(([key, score]) => {
      if (score < 70) {
        weaknesses.push(`${this.evaluationCriteria[key]?.name || key} needs improvement`);
      }
    });
    return weaknesses;
  }

  generateRecommendations(analysis, scores) {
    const recommendations = [];
    
    // Priority recommendations based on lowest scores
    const sortedScores = Object.entries(scores).sort(([,a], [,b]) => a - b);
    const lowestScore = sortedScores[0];
    
    if (lowestScore[1] < 70) {
      recommendations.push(`Focus on improving ${this.evaluationCriteria[lowestScore[0]]?.name} as your top priority`);
    }

    // Add specific recommendations from analysis
    Object.values(analysis).forEach(criteriaAnalysis => {
      if (criteriaAnalysis.suggestions) {
        recommendations.push(...criteriaAnalysis.suggestions.slice(0, 2));
      }
    });

    return recommendations.slice(0, 5); // Limit to top 5 recommendations
  }

  async getEvaluationHistory(userId, limit = 10) {
    try {
      const evaluations = await ProjectEvaluation.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('projectName overallScore grade evaluatedAt processingTime');

      return evaluations;
    } catch (error) {
      throw new Error(`Failed to get evaluation history: ${error.message}`);
    }
  }
}

module.exports = new ProjectEvaluationAgent();