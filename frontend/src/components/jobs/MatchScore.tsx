import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MatchScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

const MatchScore: React.FC<MatchScoreProps> = ({ 
  score, 
  size = 'md', 
  showLabel = true,
  animated = true 
}) => {
  const [displayScore, setDisplayScore] = useState(0);

  const sizeConfig = {
    sm: { radius: 20, strokeWidth: 3, fontSize: 'text-xs' },
    md: { radius: 30, strokeWidth: 4, fontSize: 'text-sm' },
    lg: { radius: 40, strokeWidth: 5, fontSize: 'text-lg' }
  };

  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getStrokeColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayScore(score);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayScore(score);
    }
  }, [score, animated]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg
          width={config.radius * 2 + config.strokeWidth * 2}
          height={config.radius * 2 + config.strokeWidth * 2}
          className="transform -rotate-90"
        >
          <circle
            cx={config.radius + config.strokeWidth}
            cy={config.radius + config.strokeWidth}
            r={config.radius}
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          
          <motion.circle
            cx={config.radius + config.strokeWidth}
            cy={config.radius + config.strokeWidth}
            r={config.radius}
            stroke={getStrokeColor(displayScore)}
            strokeWidth={config.strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={`font-bold ${config.fontSize} ${getScoreColor(displayScore)}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {Math.round(displayScore)}%
          </motion.span>
        </div>
      </div>
      
      {showLabel && (
        <motion.span
          className="text-xs text-gray-600 dark:text-gray-400 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Match Score
        </motion.span>
      )}
    </div>
  );
};

export default MatchScore;