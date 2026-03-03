import { motion } from 'framer-motion';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { 
  TrophyIcon,
  ChartBarIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  BookOpenIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { AssessmentResult } from '../../services/assessmentEngine';

interface EnhancedTestResultsProps {
  results: AssessmentResult & {
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
  };
}

export const EnhancedTestResults = ({ results }: EnhancedTestResultsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Advanced': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Intermediate': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Overall Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="p-6 text-center">
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(results.overallScore)}`}>
            {results.overallScore}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Overall Score</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${getLevelColor(results.competencyLevel)}`}>
            {results.competencyLevel}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">Competency Level</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {results.industryComparison.percentile}th
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Industry Percentile</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {Math.round(results.timeSpent / 60)}m
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Time Spent</div>
        </Card>
      </motion.div>

      {/* Skill Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <ChartBarIcon className="w-6 h-6 mr-2 text-blue-500" />
            Detailed Skill Analysis
          </h3>
          
          <div className="space-y-6">
            {results.skillBreakdown.map((skill, index) => (
              <motion.div
                key={skill.skill}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="border-l-4 border-blue-500 pl-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{skill.skill}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{skill.questionsAttempted} questions</span>
                      <span>{skill.timeSpent}s avg time</span>
                      <span className={getLevelColor(skill.level)}>
                        {skill.level}
                      </span>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(skill.score)}`}>
                    {skill.score}%
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
                  <motion.div
                    className={`h-3 rounded-full ${
                      skill.score >= 80 ? 'bg-green-500' : 
                      skill.score >= 70 ? 'bg-blue-500' : 
                      skill.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.score}%` }}
                    transition={{ duration: 1, delay: 0.2 * index }}
                  />
                </div>
                
                {/* Improvement Areas */}
                {skill.improvementAreas.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-orange-600 mb-1">Areas for Improvement:</div>
                    <div className="flex flex-wrap gap-1">
                      {skill.improvementAreas.map(area => (
                        <Badge key={area} variant="orange" size="sm">{area}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Mastery Indicators */}
                {skill.masteryIndicators.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-green-600 mb-1">Strengths:</div>
                    <div className="flex flex-wrap gap-1">
                      {skill.masteryIndicators.map(indicator => (
                        <Badge key={indicator} variant="green" size="sm">{indicator}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Industry Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <StarIcon className="w-6 h-6 mr-2 text-yellow-500" />
            Industry Comparison
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {results.industryComparison.percentile}%
              </div>
              <div className="text-sm text-gray-600">Your Percentile</div>
              <div className="text-xs text-gray-500 mt-1">
                Better than {results.industryComparison.percentile}% of candidates
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">
                {results.industryComparison.averageScore}%
              </div>
              <div className="text-sm text-gray-600">Industry Average</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {results.industryComparison.topPerformerScore}%
              </div>
              <div className="text-sm text-gray-600">Top 10% Score</div>
            </div>
          </div>
          
          {/* Skill Demand */}
          <div className="mt-6">
            <h4 className="font-medium mb-3">Current Market Demand</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(results.industryComparison.skillDemand).map(([skill, demand]) => (
                <div key={skill} className="text-center">
                  <div className="text-lg font-semibold text-electric-600">{demand}%</div>
                  <div className="text-xs text-gray-600">{skill}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <LightBulbIcon className="w-6 h-6 mr-2 text-yellow-500" />
            Personalized Recommendations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{rec.title}</h4>
                  <Badge className={getPriorityColor(rec.priority)} size="sm">
                    {rec.priority}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {rec.description}
                </p>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">⏱️ {rec.estimatedTime}</span>
                  <div className="flex gap-1">
                    {rec.skillsImproved.slice(0, 2).map(skill => (
                      <Badge key={skill} variant="electric" size="sm">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <ArrowTrendingUpIcon className="w-6 h-6 mr-2 text-green-500" />
            Your Next Steps
          </h3>
          
          <div className="space-y-4">
            {results.nextSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{step.action}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {step.description}
                  </p>
                  <div className="flex gap-2 text-xs">
                    <Badge variant="blue" size="sm">📅 {step.timeframe}</Badge>
                    <Badge variant="gray" size="sm">🎯 {step.difficulty}</Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Learning Path */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <BookOpenIcon className="w-6 h-6 mr-2 text-purple-500" />
            Recommended Learning Path
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {results.learningPath.map((topic, index) => (
              <motion.div
                key={topic}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-3 py-2 rounded-full"
              >
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <span className="text-sm font-medium">{topic}</span>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <AcademicCapIcon className="w-5 h-5" />
              <span className="font-medium">Pro Tip:</span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Follow this learning path sequentially for optimal skill development. 
              Each topic builds upon the previous ones.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};