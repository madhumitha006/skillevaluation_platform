export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'recruiter' | 'student';
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'recruiter' | 'student';
}

export interface Interview {
  _id: string;
  userId: string;
  title: string;
  skills: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  questions: InterviewQuestion[];
  responses: InterviewResponse[];
  evaluation?: InterviewEvaluation;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  expectedAnswer?: string;
  difficulty: string;
  skill: string;
  type: 'technical' | 'behavioral' | 'situational';
  followUp: string[];
}

export interface InterviewResponse {
  questionId: string;
  answer: string;
  transcript: string;
  confidence: number;
  sentiment: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
  };
  responseTime: number;
  submittedAt: string;
}

export interface InterviewEvaluation {
  overallScore: number;
  skillScores: Record<string, number>;
  strengths: string[];
  improvements: string[];
  feedback: string;
  recommendation: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  skills: string[];
  modules: CourseModule[];
  totalDuration: number;
  totalXP: number;
  prerequisites: string[];
  tags: string[];
  isPublished: boolean;
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'quiz' | 'coding';
  content: {
    videoUrl?: string;
    text?: string;
    code?: string;
    language?: string;
    quiz?: QuizQuestion[];
  };
  duration: number;
  xpReward: number;
  order: number;
}

export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty?: string;
  topic?: string;
}

export interface LearningPath {
  _id: string;
  userId: string;
  title: string;
  targetSkills: string[];
  skillGaps: SkillGap[];
  courses: LearningPathCourse[];
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'active' | 'completed' | 'paused';
  aiGenerated: boolean;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface LearningPathCourse {
  courseId: Course;
  order: number;
  status: 'not-started' | 'in-progress' | 'completed';
  startedAt?: string;
  completedAt?: string;
  progress: number;
}

export interface UserProgress {
  _id: string;
  userId: string;
  courseId: string;
  moduleProgress: ModuleProgress[];
  overallProgress: number;
  totalTimeSpent: number;
  xpEarned: number;
  status: 'not-started' | 'in-progress' | 'completed';
  startedAt?: string;
  completedAt?: string;
  lastAccessed?: string;
}

export interface ModuleProgress {
  moduleId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  startedAt?: string;
  completedAt?: string;
  timeSpent: number;
  attempts: number;
  score?: number;
  lastAccessed?: string;
}

export interface Gamification {
  _id: string;
  userId: string;
  level: number;
  totalXP: number;
  currentLevelXP: number;
  nextLevelXP: number;
  badges: Badge[];
  achievements: Achievement[];
  streaks: {
    current: number;
    longest: number;
    lastActivityDate?: string;
  };
  stats: {
    coursesCompleted: number;
    modulesCompleted: number;
    quizzesCompleted: number;
    codingChallengesCompleted: number;
    totalStudyTime: number;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earnedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  completedAt?: string;
  xpReward: number;
}
