import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserJourneyStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  score?: number;
  data?: any;
}

interface UserJourneyState {
  currentStep: number;
  totalScore: number;
  xpPoints: number;
  level: number;
  steps: UserJourneyStep[];
  skillData: any;
  testResults: any;
  interviewResults: any;
  
  // Actions
  completeStep: (stepId: string, data?: any) => void;
  updateStepData: (stepId: string, data: any) => void;
  calculateTotalScore: () => void;
  getNextStep: () => UserJourneyStep | null;
  addXP: (points: number) => void;
}

const initialSteps: UserJourneyStep[] = [
  { id: 'resume', title: 'Resume Upload', description: 'Upload your resume for AI analysis', completed: false },
  { id: 'extraction', title: 'Skill Extraction', description: 'AI extracts your skills', completed: false },
  { id: 'test', title: 'Adaptive Test', description: 'Take personalized skill assessment', completed: false },
  { id: 'interview', title: 'AI Interview', description: 'Complete AI-powered interview', completed: false },
  { id: 'analysis', title: 'Skill Analysis', description: 'Review detailed performance analysis', completed: false },
  { id: 'matching', title: 'Job Matching', description: 'Find matching opportunities', completed: false },
  { id: 'roadmap', title: 'Career Roadmap', description: 'Get personalized career path', completed: false },
  { id: 'learning', title: 'Learning Plan', description: 'Start skill improvement journey', completed: false }
];

export const useUserJourney = create<UserJourneyState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      totalScore: 0,
      xpPoints: 0,
      level: 1,
      steps: initialSteps,
      skillData: null,
      testResults: null,
      interviewResults: null,

      completeStep: (stepId: string, data?: any) => {
        set((state) => {
          const steps = state.steps.map(step => 
            step.id === stepId ? { ...step, completed: true, data } : step
          );
          const currentStep = Math.min(state.currentStep + 1, steps.length - 1);
          return { ...state, steps, currentStep };
        });
        get().addXP(100);
        get().calculateTotalScore();
      },

      updateStepData: (stepId: string, data: any) => {
        set((state) => ({
          steps: state.steps.map(step => 
            step.id === stepId ? { ...step, data: { ...step.data, ...data } } : step
          ),
          ...(stepId === 'test' && { testResults: data }),
          ...(stepId === 'interview' && { interviewResults: data }),
          ...(stepId === 'extraction' && { skillData: data })
        }));
      },

      calculateTotalScore: () => {
        const { steps } = get();
        const completedSteps = steps.filter(s => s.completed);
        const totalScore = completedSteps.reduce((sum, step) => sum + (step.score || 0), 0);
        set({ totalScore });
      },

      getNextStep: () => {
        const { steps, currentStep } = get();
        return steps[currentStep] || null;
      },

      addXP: (points: number) => {
        set((state) => {
          const newXP = state.xpPoints + points;
          const newLevel = Math.floor(newXP / 1000) + 1;
          return { xpPoints: newXP, level: newLevel };
        });
      }
    }),
    { name: 'user-journey' }
  )
);