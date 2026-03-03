import React from 'react';
import { motion } from 'framer-motion';

interface EvaluationScoreProps {
  score: number;
  grade: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const EvaluationScore: React.FC<EvaluationScoreProps> = ({ 
  score, 
  grade, 
  size = 'md',
  animated = true 
}) => {
  const sizeConfig = {
    sm: { radius: 25, strokeWidth: 3, fontSize: 'text-sm' },
    md: { radius: 35, strokeWidth: 4, fontSize: 'text-lg' },
    lg: { radius: 45, strokeWidth: 5, fontSize: 'text-2xl' }
  };

  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981'; // green
    if (score >= 80) return '#3b82f6'; // blue
    if (score >= 70) return '#f59e0b'; // yellow
    if (score >= 60) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const getGradeColor = (grade: string) => {
    if (['A+', 'A'].includes(grade)) return 'text-green-600';
    if (['B+', 'B'].includes(grade)) return 'text-blue-600';
    if (['C+', 'C'].includes(grade)) return 'text-yellow-600';
    if (grade === 'D') return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg
          width={config.radius * 2 + config.strokeWidth * 2}
          height={config.radius * 2 + config.strokeWidth * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={config.radius + config.strokeWidth}
            cy={config.radius + config.strokeWidth}
            r={config.radius}
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={config.radius + config.strokeWidth}
            cy={config.radius + config.strokeWidth}
            r={config.radius}
            stroke={getScoreColor(score)}
            strokeWidth={config.strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={animated ? { strokeDashoffset: circumference } : {}}
            animate={animated ? { strokeDashoffset } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        {/* Score and grade text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`font-bold ${config.fontSize} text-gray-900 dark:text-white`}
            initial={animated ? { opacity: 0, scale: 0.5 } : {}}
            animate={animated ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {score}
          </motion.span>
          <motion.span
            className={`text-xs font-semibold ${getGradeColor(grade)}`}
            initial={animated ? { opacity: 0 } : {}}
            animate={animated ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            {grade}
          </motion.span>
        </div>
      </div>
    </div>
  );
};

export default EvaluationScore;