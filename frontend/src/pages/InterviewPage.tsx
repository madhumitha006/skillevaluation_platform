import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { InterviewQuestion } from '@/components/interview/InterviewQuestion';
import { InterviewResults } from '@/components/interview/InterviewResults';
import interviewService from '@/services/interviewService';
import { Interview } from '@/types';

export const InterviewPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (interviewId) {
      loadInterview();
    }
  }, [interviewId]);

  const loadInterview = async () => {
    try {
      setIsLoading(true);
      const response = await interviewService.getInterview(interviewId!);
      setInterview(response.data);
      
      if (response.data.status === 'completed') {
        setShowResults(true);
      }
    } catch (error) {
      console.error('Failed to load interview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startInterview = async () => {
    try {
      await interviewService.startInterview(interviewId!);
      setInterview(prev => prev ? { ...prev, status: 'in-progress' } : null);
    } catch (error) {
      console.error('Failed to start interview:', error);
    }
  };

  const handleQuestionComplete = async (response: {
    answer: string;
    transcript: string;
    responseTime: number;
  }) => {
    if (!interview) return;

    try {
      const currentQuestion = interview.questions[currentQuestionIndex];
      await interviewService.submitResponse(interviewId!, {
        questionId: currentQuestion.id,
        ...response,
      });

      if (currentQuestionIndex < interview.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        await completeInterview();
      }
    } catch (error) {
      console.error('Failed to submit response:', error);
    }
  };

  const completeInterview = async () => {
    try {
      const response = await interviewService.completeInterview(interviewId!);
      setInterview(response.data.interview);
      setShowResults(true);
    } catch (error) {
      console.error('Failed to complete interview:', error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-500"></div>
        </div>
      </Layout>
    );
  }

  if (!interview) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Interview not found</h2>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </Layout>
    );
  }

  if (showResults) {
    return (
      <Layout>
        <InterviewResults interview={interview} />
      </Layout>
    );
  }

  const currentQuestion = interview.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / interview.questions.length) * 100;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-3xl font-bold">{interview.title}</h1>
          <div className="flex justify-center gap-2">
            {interview.skills.map((skill) => (
              <Badge key={skill} variant="electric">
                {skill}
              </Badge>
            ))}
          </div>
        </motion.div>

        <Card className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {interview.questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-electric-500 to-violet-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </Card>

        <AnimatePresence mode="wait">
          {interview.status === 'pending' ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-6"
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
                <p className="text-gray-600 mb-6">
                  This interview will test your knowledge in {interview.skills.join(', ')}.
                  You'll have {interview.questions.length} questions to answer.
                </p>
                <Button size="lg" onClick={startInterview}>
                  Start Interview
                </Button>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key={`question-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <InterviewQuestion
                question={currentQuestion}
                onComplete={handleQuestionComplete}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={interview.questions.length}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};