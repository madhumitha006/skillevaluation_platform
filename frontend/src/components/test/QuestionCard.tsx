import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Question {
  id: string;
  type: 'multiple-choice' | 'text' | 'code';
  question: string;
  options?: string[];
  skill: string;
  difficulty: string;
}

interface QuestionCardProps {
  question: Question;
  answer: any;
  onAnswerChange: (answer: any) => void;
  questionNumber: number;
}

export const QuestionCard = ({ question, answer, onAnswerChange, questionNumber }: QuestionCardProps) => {
  const [localAnswer, setLocalAnswer] = useState(answer);

  useEffect(() => {
    const timer = setTimeout(() => {
      onAnswerChange(localAnswer);
    }, 500);
    return () => clearTimeout(timer);
  }, [localAnswer, onAnswerChange]);

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLocalAnswer(idx)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                  localAnswer === idx
                    ? 'bg-gradient-to-r from-electric-500 to-violet-600 text-white shadow-lg'
                    : 'glass hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    localAnswer === idx ? 'border-white' : 'border-gray-400'
                  }`}>
                    {localAnswer === idx && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 rounded-full bg-white"
                      />
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 'text':
        return (
          <textarea
            value={localAnswer || ''}
            onChange={(e) => setLocalAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full h-40 p-4 glass rounded-xl focus:ring-2 focus:ring-electric-500 focus:border-transparent outline-none resize-none"
          />
        );

      case 'code':
        return (
          <textarea
            value={localAnswer || ''}
            onChange={(e) => setLocalAnswer(e.target.value)}
            placeholder="// Write your code here..."
            className="w-full h-64 p-4 glass rounded-xl focus:ring-2 focus:ring-electric-500 focus:border-transparent outline-none resize-none font-mono text-sm"
          />
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-2xl p-8 shadow-xl"
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {questionNumber}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-electric-500">{question.skill}</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{question.difficulty}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{question.question}</h3>
        </div>
      </div>

      {renderQuestionContent()}

      {localAnswer !== null && localAnswer !== undefined && localAnswer !== '' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Answer auto-saved
        </motion.div>
      )}
    </motion.div>
  );
};
