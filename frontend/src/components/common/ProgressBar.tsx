import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  difficulty?: 'beginner' | 'intermediate' | 'expert';
}

export const ProgressBar = ({ current, total, difficulty }: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, isNaN(current) || isNaN(total) || total === 0 ? 0 : (current / total) * 100));

  const difficultyColors = {
    beginner: 'from-green-500 to-green-600',
    intermediate: 'from-electric-500 to-electric-600',
    expert: 'from-violet-500 to-violet-600',
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold">
          Question {current} of {total}
        </span>
        {difficulty && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${difficultyColors[difficulty]} text-white`}
          >
            {difficulty}
          </motion.span>
        )}
      </div>
      <div className="h-3 bg-gray-200 dark:bg-navy-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${difficulty ? difficultyColors[difficulty] : 'from-electric-500 to-violet-600'} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
