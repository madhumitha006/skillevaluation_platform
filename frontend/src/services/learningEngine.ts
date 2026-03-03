export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  courses: string[];
  prerequisites: string[];
  outcomes: string[];
  progress: number;
  personalizedFor: string[];
}

export interface AdaptiveCourse {
  id: string;
  title: string;
  description: string;
  modules: AdaptiveModule[];
  difficulty: string;
  estimatedTime: number;
  prerequisites: string[];
  skills: string[];
  adaptiveFeatures: {
    personalizedContent: boolean;
    difficultyAdjustment: boolean;
    paceAdaptation: boolean;
    contentRecommendations: boolean;
  };
}

export interface AdaptiveModule {
  id: string;
  title: string;
  lessons: AdaptiveLesson[];
  quiz: QuizData;
  project?: ProjectData;
  adaptiveElements: {
    difficultyVariants: DifficultyVariant[];
    personalizedExamples: boolean;
    adaptiveExercises: boolean;
  };
}

export interface AdaptiveLesson {
  id: string;
  title: string;
  content: LessonContent[];
  interactiveElements: InteractiveElement[];
  adaptiveContent: {
    beginnerVersion?: string;
    intermediateVersion?: string;
    advancedVersion?: string;
  };
}

export interface InteractiveElement {
  type: 'code-playground' | 'quiz' | 'simulation' | 'drag-drop' | 'fill-blank';
  id: string;
  title: string;
  content: any;
  validation: ValidationRule[];
}

export interface LearningAnalytics {
  userId: string;
  courseProgress: CourseProgress[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  preferredPace: 'slow' | 'normal' | 'fast';
  strongAreas: string[];
  weakAreas: string[];
  timeSpentByTopic: { [topic: string]: number };
  completionRates: { [courseId: string]: number };
  engagementScore: number;
  lastActive: Date;
}

export class AdvancedLearningEngine {
  private userAnalytics: Map<string, LearningAnalytics> = new Map();
  
  generatePersonalizedPath(
    userSkills: string[],
    targetRole: string,
    currentLevel: string,
    timeAvailable: number
  ): LearningPath {
    const pathTemplates = this.getPathTemplates();
    const relevantPaths = pathTemplates.filter(path => 
      path.targetRoles.includes(targetRole) && 
      path.difficulty === currentLevel
    );
    
    const customPath = this.customizePath(relevantPaths[0], userSkills, timeAvailable);
    return customPath;
  }

  adaptContentDifficulty(
    content: string,
    userLevel: string,
    performance: number
  ): string {
    if (performance < 0.6 && userLevel !== 'beginner') {
      return this.simplifyContent(content);
    } else if (performance > 0.9 && userLevel !== 'advanced') {
      return this.enhanceContent(content);
    }
    return content;
  }

  getPersonalizedRecommendations(userId: string): CourseRecommendation[] {
    const analytics = this.userAnalytics.get(userId);
    if (!analytics) return [];

    const recommendations: CourseRecommendation[] = [];
    
    // Skill gap recommendations
    analytics.weakAreas.forEach(area => {
      recommendations.push({
        type: 'skill-gap',
        courseId: `${area.toLowerCase()}-fundamentals`,
        title: `${area} Fundamentals`,
        reason: `Strengthen your ${area} skills`,
        priority: 'high',
        estimatedTime: '2-3 weeks'
      });
    });

    // Next level recommendations
    analytics.strongAreas.forEach(area => {
      recommendations.push({
        type: 'advancement',
        courseId: `advanced-${area.toLowerCase()}`,
        title: `Advanced ${area}`,
        reason: `Build on your ${area} expertise`,
        priority: 'medium',
        estimatedTime: '3-4 weeks'
      });
    });

    return recommendations.slice(0, 6);
  }

  trackLearningProgress(
    userId: string,
    courseId: string,
    moduleId: string,
    lessonId: string,
    timeSpent: number,
    performance: number
  ): void {
    let analytics = this.userAnalytics.get(userId);
    if (!analytics) {
      analytics = this.initializeUserAnalytics(userId);
    }

    // Update progress
    const courseProgress = analytics.courseProgress.find(cp => cp.courseId === courseId);
    if (courseProgress) {
      courseProgress.completedLessons.add(lessonId);
      courseProgress.timeSpent += timeSpent;
      courseProgress.averagePerformance = 
        (courseProgress.averagePerformance + performance) / 2;
    }

    // Update analytics
    analytics.timeSpentByTopic[this.getTopicFromLesson(lessonId)] = 
      (analytics.timeSpentByTopic[this.getTopicFromLesson(lessonId)] || 0) + timeSpent;
    
    analytics.lastActive = new Date();
    this.userAnalytics.set(userId, analytics);
  }

  generateInteractiveExercise(
    topic: string,
    difficulty: string,
    userPerformance: number
  ): InteractiveElement {
    const exerciseTemplates = this.getExerciseTemplates(topic);
    const appropriateTemplate = exerciseTemplates.find(t => 
      t.difficulty === difficulty
    ) || exerciseTemplates[0];

    return {
      type: 'code-playground',
      id: `exercise-${Date.now()}`,
      title: appropriateTemplate.title,
      content: {
        description: appropriateTemplate.description,
        starterCode: appropriateTemplate.starterCode,
        solution: appropriateTemplate.solution,
        hints: this.generateHints(appropriateTemplate, userPerformance),
        tests: appropriateTemplate.tests
      },
      validation: appropriateTemplate.validation
    };
  }

  private getPathTemplates(): PathTemplate[] {
    return [
      {
        id: 'frontend-developer',
        title: 'Frontend Developer Path',
        targetRoles: ['Frontend Developer', 'React Developer', 'UI Developer'],
        difficulty: 'beginner',
        courses: [
          'html-css-fundamentals',
          'javascript-essentials',
          'react-basics',
          'responsive-design',
          'frontend-tools'
        ],
        estimatedTime: 12
      },
      {
        id: 'fullstack-developer',
        title: 'Full Stack Developer Path',
        targetRoles: ['Full Stack Developer', 'Web Developer'],
        difficulty: 'intermediate',
        courses: [
          'javascript-advanced',
          'react-mastery',
          'nodejs-backend',
          'database-design',
          'api-development',
          'deployment-devops'
        ],
        estimatedTime: 16
      },
      {
        id: 'data-scientist',
        title: 'Data Science Path',
        targetRoles: ['Data Scientist', 'ML Engineer', 'Data Analyst'],
        difficulty: 'intermediate',
        courses: [
          'python-fundamentals',
          'data-analysis-pandas',
          'machine-learning-basics',
          'deep-learning',
          'data-visualization',
          'ml-deployment'
        ],
        estimatedTime: 20
      }
    ];
  }

  private customizePath(
    template: PathTemplate,
    userSkills: string[],
    timeAvailable: number
  ): LearningPath {
    // Filter out courses for skills user already has
    const filteredCourses = template.courses.filter(courseId => {
      const courseSkills = this.getCourseSkills(courseId);
      return !courseSkills.every(skill => userSkills.includes(skill));
    });

    // Adjust based on time available
    const adjustedCourses = timeAvailable < template.estimatedTime 
      ? filteredCourses.slice(0, Math.ceil(filteredCourses.length * 0.7))
      : filteredCourses;

    return {
      id: `${template.id}-personalized`,
      title: `Personalized ${template.title}`,
      description: `Customized learning path based on your current skills and goals`,
      difficulty: template.difficulty,
      estimatedTime: Math.ceil(adjustedCourses.length * 2.5),
      courses: adjustedCourses,
      prerequisites: [],
      outcomes: this.generateOutcomes(adjustedCourses),
      progress: 0,
      personalizedFor: userSkills
    };
  }

  private simplifyContent(content: string): string {
    return content
      .replace(/advanced concepts?/gi, 'basic concepts')
      .replace(/complex/gi, 'simple')
      .replace(/optimization/gi, 'improvement');
  }

  private enhanceContent(content: string): string {
    return content + '\n\n**Advanced Note:** Consider exploring performance optimizations and edge cases for production use.';
  }

  private initializeUserAnalytics(userId: string): LearningAnalytics {
    return {
      userId,
      courseProgress: [],
      learningStyle: 'mixed',
      preferredPace: 'normal',
      strongAreas: [],
      weakAreas: [],
      timeSpentByTopic: {},
      completionRates: {},
      engagementScore: 0,
      lastActive: new Date()
    };
  }

  private getTopicFromLesson(lessonId: string): string {
    // Extract topic from lesson ID
    return lessonId.split('-')[0] || 'general';
  }

  private getExerciseTemplates(topic: string): ExerciseTemplate[] {
    const templates: { [key: string]: ExerciseTemplate[] } = {
      'javascript': [
        {
          title: 'Array Manipulation Challenge',
          description: 'Create functions to manipulate arrays effectively',
          difficulty: 'beginner',
          starterCode: 'function processArray(arr) {\n  // Your code here\n}',
          solution: 'function processArray(arr) {\n  return arr.filter(x => x > 0).map(x => x * 2);\n}',
          tests: ['processArray([1, -2, 3, -4, 5]) should return [2, 6, 10]'],
          validation: []
        }
      ],
      'react': [
        {
          title: 'Component State Management',
          description: 'Build a counter component with state',
          difficulty: 'beginner',
          starterCode: 'function Counter() {\n  // Add state and handlers\n  return <div></div>;\n}',
          solution: 'function Counter() {\n  const [count, setCount] = useState(0);\n  return <div><button onClick={() => setCount(count + 1)}>{count}</button></div>;\n}',
          tests: ['Component should render count', 'Button should increment count'],
          validation: []
        }
      ]
    };
    
    return templates[topic] || [];
  }

  private generateHints(template: ExerciseTemplate, performance: number): string[] {
    const baseHints = [
      'Start by understanding the problem requirements',
      'Break down the solution into smaller steps',
      'Test your solution with the provided examples'
    ];
    
    if (performance < 0.5) {
      return [
        ...baseHints,
        'Review the lesson content before attempting',
        'Try solving a simpler version first'
      ];
    }
    
    return baseHints;
  }

  private getCourseSkills(courseId: string): string[] {
    const skillMap: { [key: string]: string[] } = {
      'javascript-essentials': ['JavaScript', 'ES6', 'DOM'],
      'react-basics': ['React', 'JSX', 'Components'],
      'nodejs-backend': ['Node.js', 'Express', 'APIs'],
      'python-fundamentals': ['Python', 'Data Types', 'Functions']
    };
    
    return skillMap[courseId] || [];
  }

  private generateOutcomes(courses: string[]): string[] {
    return courses.map(courseId => {
      const skills = this.getCourseSkills(courseId);
      return `Master ${skills.join(', ')} concepts and applications`;
    });
  }
}

interface PathTemplate {
  id: string;
  title: string;
  targetRoles: string[];
  difficulty: string;
  courses: string[];
  estimatedTime: number;
}

interface CourseProgress {
  courseId: string;
  completedLessons: Set<string>;
  timeSpent: number;
  averagePerformance: number;
}

interface CourseRecommendation {
  type: 'skill-gap' | 'advancement' | 'trending';
  courseId: string;
  title: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
}

interface ExerciseTemplate {
  title: string;
  description: string;
  difficulty: string;
  starterCode: string;
  solution: string;
  tests: string[];
  validation: ValidationRule[];
}

interface ValidationRule {
  type: string;
  condition: string;
  message: string;
}

interface DifficultyVariant {
  level: string;
  content: string;
  exercises: string[];
}

interface QuizData {
  questions: QuizQuestion[];
  passingScore: number;
  adaptiveScoring: boolean;
}

interface ProjectData {
  title: string;
  description: string;
  requirements: string[];
  starterFiles: { [filename: string]: string };
  solution: { [filename: string]: string };
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: string;
}

interface LessonContent {
  type: 'text' | 'video' | 'interactive';
  content: string;
  duration: number;
}

export const learningEngine = new AdvancedLearningEngine();