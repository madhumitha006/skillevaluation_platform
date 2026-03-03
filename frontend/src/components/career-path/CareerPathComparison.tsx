import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrophyIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  AcademicCapIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { CareerComparison } from '../../services/careerPathService';

interface CareerPathComparisonProps {
  comparison: CareerComparison;
}

const CareerPathComparison: React.FC<CareerPathComparisonProps> = ({ comparison }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBestInCategory = (category: keyof typeof comparison.paths[0]) => {
    if (category === 'timeToTarget') {
      return comparison.paths.reduce((min, path) => 
        path[category] < min[category] ? path : min
      );
    }
    return comparison.paths.reduce((max, path) => 
      path[category] > max[category] ? path : max
    );
  };

  const formatSalary = (salary: number) => {
    return `$${(salary / 1000).toFixed(0)}k`;
  };

  return (
    <div className="space-y-6">
      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {comparison.paths.map((path, index) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="premium-card p-6"
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {path.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Target: {path.targetRole}
              </p>
            </div>

            <div className="space-y-4">
              {/* Confidence Score */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrophyIcon className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Success Rate
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${getScoreColor(path.confidenceScore)}`}>
                    {path.confidenceScore}%
                  </span>
                  {getBestInCategory('confidenceScore').id === path.id && (
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>

              {/* Time to Target */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Time to Target
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {path.timeToTarget} years
                  </span>
                  {getBestInCategory('timeToTarget').id === path.id && (
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>

              {/* Final Salary */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Final Salary
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatSalary(path.finalSalary)}
                  </span>
                  {getBestInCategory('finalSalary').id === path.id && (
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>

              {/* Salary Growth */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Salary Growth
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-green-600">
                    +{path.salaryGrowth}%
                  </span>
                  {getBestInCategory('salaryGrowth').id === path.id && (
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>

              {/* Skills Required */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AcademicCapIcon className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Skills to Learn
                  </span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">
                  {path.skillsRequired}
                </span>
              </div>

              {/* Certifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Certifications
                  </span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">
                  {path.certificationsNeeded}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Overall Score</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {path.confidenceScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${path.confidenceScore}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                  className={`h-2 rounded-full ${
                    path.confidenceScore >= 80 ? 'bg-green-500' :
                    path.confidenceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="premium-card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          AI Recommendations
        </h3>
        <div className="space-y-3">
          {comparison.recommendations.map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">{recommendation}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CareerPathComparison;