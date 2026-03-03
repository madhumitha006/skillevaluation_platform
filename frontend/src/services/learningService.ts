import api from './api';
import { Course, LearningPath, UserProgress, Gamification, QuizQuestion } from '@/types';

export interface GenerateLearningPathData {
  targetSkills: Array<{ skill: string; level: number; importance?: number }>;
  currentSkills: Array<{ skill: string; level: number }>;
}

export interface CompleteModuleData {
  timeSpent: number;
  score?: number;
}

export interface GenerateQuizData {
  topic: string;
  difficulty?: 'beginner' | 'medium' | 'advanced';
  questionCount?: number;
}

class LearningService {
  async getCourses(params?: {
    category?: string;
    difficulty?: string;
    skills?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get('/learning/courses', { params });
    return response.data;
  }

  async getCourse(courseId: string) {
    const response = await api.get(`/learning/courses/${courseId}`);
    return response.data;
  }

  async generateLearningPath(data: GenerateLearningPathData) {
    const response = await api.post('/learning/learning-paths/generate', data);
    return response.data;
  }

  async getUserLearningPaths() {
    const response = await api.get('/learning/learning-paths');
    return response.data;
  }

  async startModule(courseId: string, moduleId: string) {
    const response = await api.post(`/learning/courses/${courseId}/modules/${moduleId}/start`);
    return response.data;
  }

  async completeModule(courseId: string, moduleId: string, data: CompleteModuleData) {
    const response = await api.post(`/learning/courses/${courseId}/modules/${moduleId}/complete`, data);
    return response.data;
  }

  async generateQuiz(data: GenerateQuizData) {
    const response = await api.post('/learning/quiz/generate', data);
    return response.data;
  }

  async getUserProgress(courseId: string) {
    const response = await api.get(`/learning/progress/${courseId}`);
    return response.data;
  }

  async getGamificationData() {
    const response = await api.get('/learning/gamification');
    return response.data;
  }

  async getRevisionItems() {
    const response = await api.get('/learning/revision');
    return response.data;
  }
}

export default new LearningService();