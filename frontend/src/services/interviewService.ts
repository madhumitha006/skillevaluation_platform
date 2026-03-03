import api from './api';
import { Interview, InterviewResponse } from '@/types';

export interface CreateInterviewData {
  title: string;
  skills: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface SubmitResponseData {
  questionId: string;
  answer: string;
  transcript: string;
  responseTime: number;
}

class InterviewService {
  async createInterview(data: CreateInterviewData) {
    const response = await api.post('/interviews', data);
    return response.data;
  }

  async startInterview(interviewId: string) {
    const response = await api.patch(`/interviews/${interviewId}/start`);
    return response.data;
  }

  async submitResponse(interviewId: string, data: SubmitResponseData) {
    const response = await api.post(`/interviews/${interviewId}/responses`, data);
    return response.data;
  }

  async completeInterview(interviewId: string) {
    const response = await api.patch(`/interviews/${interviewId}/complete`);
    return response.data;
  }

  async getInterview(interviewId: string) {
    const response = await api.get(`/interviews/${interviewId}`);
    return response.data;
  }

  async getUserInterviews(params?: { page?: number; limit?: number; status?: string }) {
    const response = await api.get('/interviews', { params });
    return response.data;
  }

  async getFollowUpQuestion(interviewId: string, questionId: string) {
    const response = await api.get(`/interviews/${interviewId}/questions/${questionId}/followup`);
    return response.data;
  }
}

export default new InterviewService();