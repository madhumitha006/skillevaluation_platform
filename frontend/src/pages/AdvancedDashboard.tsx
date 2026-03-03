import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { 
  ChartBarIcon,
  TrophyIcon,
  LightBulbIcon,
  StarIcon,
  FireIcon,
  ClockIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { dashboardEngine, DashboardAnalytics, ActivityMetrics } from '../services/dashboardEngine';
import { useNavigate } from 'react-router-dom';

export const AdvancedDashboard = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [activityMetrics, setActivityMetrics] = useState<ActivityMetrics | null>(null);
  const [careerInsights, setCareerInsights] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'insights' | 'achievements'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Mock user profile
      const userProfile = {
        skills: ['React', 'TypeScript', 'Node.js', 'JavaScript'],
        skillLevels: { 'React': 4, 'TypeScript': 3, 'Node.js': 3, 'JavaScript': 5 },
        experience: 5,
        currentRole: 'Frontend Developer',
        targetRole: 'Senior Frontend Developer'
      };

      // Generate dashboard analytics
      const dashboardAnalytics = dashboardEngine.generateDashboardAnalytics('user-123', userProfile);
      setAnalytics(dashboardAnalytics);

      // Get activity metrics
      const activity = dashboardEngine.getActivityMetrics('user-123');
      setActivityMetrics(activity);

      // Get career insights
      const insights = dashboardEngine.getCareerInsights('user-123');
      setCareerInsights(insights);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'epic': return 'bg-gradient-to-r from-blue-500 to-purple-500 text-white';
      case 'rare': return 'bg-gradient-to-r from-green-500 to-blue-500 text-white';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <div className={`text-4xl font-bold mb-2 ${getScoreColor(analytics?.careerScore || 0).split(' ')[0]}`}>
              {analytics?.careerScore}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Career Score</div>
            <div className="text-xs text-blue-600 mt-1">
              {analytics?.careerScore && analytics.careerScore > 80 ? 'Excellent' : 'Good'} performance
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {analytics?.marketPosition.percentile}th
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Market Percentile</div>
            <div className="text-xs text-green-600 mt-1">
              {analytics?.marketPosition.demandLevel} demand
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {analytics?.skillVelocity.toFixed(1)}x
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Learning Velocity</div>
            <div className="text-xs text-purple-600 mt-1">Above average</div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-6 text-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {analytics?.careerTrajectory.progressToNext}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Next Level Progress</div>
            <div className="text-xs text-orange-600 mt-1">
              {analytics?.careerTrajectory.timeToPromotion}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Career Trajectory */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <ArrowTrendingUpIcon className="w-6 h-6 mr-2 text-blue-500" />
            Career Trajectory
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">Current</div>
              <div className="text-2xl font-bold text-blue-600 mt-2">
                {analytics?.careerTrajectory.currentLevel}
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${analytics?.careerTrajectory.progressToNext}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">Target</div>
              <div className="text-2xl font-bold text-purple-600 mt-2">
                {analytics?.careerTrajectory.nextLevel}
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Skills needed for next level:
            </div>
            <div className="flex flex-wrap gap-2">
              {analytics?.careerTrajectory.skillDevelopmentNeeded.map(skill => (
                <Badge key={skill} variant="blue" size="sm">{skill}</Badge>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Skill Gaps */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <ExclamationTriangleIcon className="w-6 h-6 mr-2 text-yellow-500" />
            Priority Skill Gaps
          </h3>
          
          <div className="space-y-4">
            {analytics?.skillGaps.slice(0, 3).map((gap, index) => (
              <motion.div
                key={gap.skill}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{gap.skill}</h4>
                    <Badge 
                      variant={
                        gap.priority === 'critical' ? 'red' :
                        gap.priority === 'high' ? 'orange' :
                        gap.priority === 'medium' ? 'yellow' : 'gray'
                      } 
                      size="sm"
                    >
                      {gap.priority}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Current: Level {gap.currentLevel}</span>
                    <span>Target: Level {gap.targetLevel}</span>
                    <span>Time: {gap.timeToClose}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-green-500 h-2 rounded-full"
                      style={{ width: `${(gap.currentLevel / gap.targetLevel) * 100}%` }}
                    />
                  </div>
                </div>
                
                <Button size="sm" onClick={() => navigate('/learning')}>
                  Learn
                </Button>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Weekly Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <ChartBarIcon className="w-6 h-6 mr-2 text-green-500" />
            Weekly Progress
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {activityMetrics?.weeklyProgress.currentWeek.learningHours}h
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Learning Time</div>
              <div className="flex items-center justify-center mt-1">
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-xs text-green-600">
                  +{activityMetrics?.weeklyProgress.improvement.learningHours}h
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {activityMetrics?.weeklyProgress.currentWeek.completedCourses}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Courses Done</div>
              <div className="flex items-center justify-center mt-1">
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-xs text-green-600">
                  +{activityMetrics?.weeklyProgress.improvement.completedCourses}
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {activityMetrics?.weeklyProgress.currentWeek.skillsAdvanced}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Skills Advanced</div>
              <div className="flex items-center justify-center mt-1">
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-xs text-green-600">
                  +{activityMetrics?.weeklyProgress.improvement.skillsAdvanced}
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {activityMetrics?.weeklyProgress.currentWeek.assessmentScore}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Score</div>
              <div className="flex items-center justify-center mt-1">
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-xs text-green-600">
                  +{activityMetrics?.weeklyProgress.improvement.assessmentScore}%
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );

  const renderPredictiveInsights = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">AI-Powered Insights</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Predictive analytics for your career growth
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analytics?.predictiveInsights.map((insight, index) => (
          <motion.div
            key={insight.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="p-6 h-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{insight.title}</h3>
                <Badge variant="electric" size="sm">
                  {insight.confidence}% confidence
                </Badge>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {insight.prediction}
              </p>
              
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Recommended Actions:</div>
                <div className="space-y-1">
                  {insight.recommendations.map((rec, idx) => (
                    <div key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Timeframe: {insight.timeframe}</span>
                {insight.actionable && (
                  <Button size="sm">Take Action</Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Career Recommendations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <LightBulbIcon className="w-6 h-6 mr-2 text-yellow-500" />
            Career Recommendations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics?.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{rec.title}</h4>
                  <div className="flex gap-1">
                    <Badge 
                      variant={rec.impact === 'high' ? 'green' : rec.impact === 'medium' ? 'yellow' : 'gray'} 
                      size="sm"
                    >
                      {rec.impact} impact
                    </Badge>
                    <Badge 
                      variant={rec.effort === 'low' ? 'green' : rec.effort === 'medium' ? 'yellow' : 'red'} 
                      size="sm"
                    >
                      {rec.effort} effort
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {rec.description}
                </p>
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">⏱️ {rec.timeframe}</span>
                  <span className="text-green-600 font-medium">{rec.expectedOutcome}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Your Achievements</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Celebrate your learning milestones
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analytics?.achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className={`p-6 text-center ${getRarityColor(achievement.rarity)}`}>
              <div className="text-4xl mb-4">{achievement.badge}</div>
              <h3 className="text-lg font-bold mb-2">{achievement.title}</h3>
              <p className="text-sm opacity-90 mb-4">{achievement.description}</p>
              
              <div className="flex justify-between items-center text-sm">
                <Badge variant="white" size="sm">
                  {achievement.category}
                </Badge>
                <span className="opacity-75">
                  +{achievement.xpReward} XP
                </span>
              </div>
              
              <div className="text-xs opacity-75 mt-2">
                Earned {achievement.earnedDate.toLocaleDateString()}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Career Intelligence Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered insights for your professional growth
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="glass rounded-xl p-1 flex gap-1">
            {[
              { key: 'overview', label: 'Overview', icon: '📊' },
              { key: 'analytics', label: 'Analytics', icon: '📈' },
              { key: 'insights', label: 'AI Insights', icon: '🤖' },
              { key: 'achievements', label: 'Achievements', icon: '🏆' },
            ].map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'bg-electric-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'analytics' && renderOverview()} {/* Reuse for now */}
          {activeTab === 'insights' && renderPredictiveInsights()}
          {activeTab === 'achievements' && renderAchievements()}
        </motion.div>
      </div>
    </Layout>
  );
};