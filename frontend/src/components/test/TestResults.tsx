import { motion } from 'framer-motion';
import { TrophyIcon, ClockIcon, ChartBarIcon, LightBulbIcon } from '@heroicons/react/24/outline';

interface TestResultsProps {
  results: {
    overallScore: number;
    correctAnswers: number;
    totalQuestions: number;
    timeSpent: number;
    skillBreakdown: Array<{
      skill: string;
      score: number;
      total: number;
      correct: number;
    }>;
    difficulty: string;
  };
}

export const TestResults = ({ results }: TestResultsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getRecommendations = () => {
    if (results.overallScore >= 80) {
      return [
        'Excellent performance! Consider taking advanced level assessments.',
        'You\'re ready for senior-level positions in your field.',
        'Consider mentoring others or contributing to open source projects.'
      ];
    } else if (results.overallScore >= 60) {
      return [
        'Good foundation! Focus on areas where you scored below 70%.',
        'Practice more complex problems in your weaker areas.',
        'Consider taking online courses to strengthen specific skills.'
      ];
    } else {
      return [
        'Focus on fundamental concepts in your chosen areas.',
        'Start with beginner-level courses and practice regularly.',
        'Consider pair programming or study groups for better learning.'
      ];
    }
  };

  return (
    <div className="space-y-6">
      {/* Skill Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.skillBreakdown.map((skill, index) => (
          <motion.div
            key={skill.skill}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="font-semibold text-gray-900 dark:text-white mb-2">
              {skill.skill}
            </div>
            <div className={`text-2xl font-bold mb-1 ${getScoreColor(skill.score)}`}>
              {skill.score}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {skill.correct || 0} of {skill.total} correct
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div 
                className={`h-2 rounded-full ${getProgressColor(skill.score)}`}
                initial={{ width: 0 }}
                animate={{ width: `${skill.score}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance Insights */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <ChartBarIcon className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300">
            Performance Insights
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.floor((results.timeSpent || 0) / 60)}m {(results.timeSpent || 0) % 60}s
            </div>
            <div className="text-gray-600 dark:text-gray-400">Time Taken</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.floor(((results.timeSpent || 0) / results.totalQuestions) / 60)}m
            </div>
            <div className="text-gray-600 dark:text-gray-400">Avg per Question</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {results.difficulty || 'Mixed'}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Difficulty Level</div>
          </div>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <LightBulbIcon className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-300">
            Recommendations
          </h3>
        </div>
        <div className="space-y-2 text-sm text-green-800 dark:text-green-400">
          {getRecommendations().map((rec, index) => (
            <motion.p 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
            >
              • {rec}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </div>
  );
};