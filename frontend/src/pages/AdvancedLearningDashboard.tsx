import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { 
  AcademicCapIcon,
  ChartBarIcon,
  LightBulbIcon,
  TrophyIcon,
  ClockIcon,
  FireIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  BookOpenIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { learningEngine } from '../services/learningEngine';
import { useNavigate } from 'react-router-dom';

export const AdvancedLearningDashboard = () => {
  const navigate = useNavigate();
  const [personalizedPaths, setPersonalizedPaths] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [learningAnalytics, setLearningAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'paths' | 'courses' | 'progress'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLearningData();
  }, []);

  const loadLearningData = async () => {
    try {
      setIsLoading(true);
      
      // Generate personalized learning paths
      const frontendPath = learningEngine.generatePersonalizedPath(
        ['HTML', 'CSS'], 
        'Frontend Developer', 
        'beginner', 
        12
      );
      
      const fullstackPath = learningEngine.generatePersonalizedPath(
        ['JavaScript', 'React'], 
        'Full Stack Developer', 
        'intermediate', 
        16
      );

      setPersonalizedPaths([frontendPath, fullstackPath]);

      // Get personalized recommendations
      const userRecommendations = learningEngine.getPersonalizedRecommendations('user-123');
      setRecommendations(userRecommendations);

      // Mock learning analytics
      setLearningAnalytics({
        totalTimeSpent: 4800, // 80 hours
        coursesCompleted: 8,
        currentStreak: 12,
        longestStreak: 28,
        skillsImproved: 15,
        certificatesEarned: 3,
        weeklyGoal: 10, // hours
        weeklyProgress: 7.5,
        learningVelocity: 'Fast', // Fast, Normal, Slow
        strongestSkill: 'JavaScript',
        improvingSkill: 'React',
        recentAchievements: [
          { title: 'JavaScript Master', date: '2024-01-15', icon: '🏆' },
          { title: '30-Day Streak', date: '2024-01-10', icon: '🔥' },
          { title: 'React Basics Complete', date: '2024-01-08', icon: '⚛️' }
        ],
        skillProgress: [
          { skill: 'JavaScript', level: 85, trend: 'up' },
          { skill: 'React', level: 72, trend: 'up' },
          { skill: 'Node.js', level: 45, trend: 'stable' },
          { skill: 'Python', level: 38, trend: 'up' },
          { skill: 'Algorithms', level: 62, trend: 'down' }
        ]
      });

    } catch (error) {
      console.error('Failed to load learning data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Math.round(learningAnalytics?.totalTimeSpent / 60)}h
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Learning Time</div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {learningAnalytics?.coursesCompleted}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Courses Completed</div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6 text-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <div className="text-3xl font-bold text-orange-600 mb-2 flex items-center justify-center gap-1">
              <FireIcon className="w-8 h-8" />
              {learningAnalytics?.currentStreak}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {learningAnalytics?.skillsImproved}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Skills Improved</div>
          </Card>
        </motion.div>
      </div>

      {/* Weekly Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Weekly Learning Goal</h3>
            <Badge variant="green">
              {learningAnalytics?.weeklyProgress}/{learningAnalytics?.weeklyGoal}h
            </Badge>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${Math.min(100, (learningAnalytics?.weeklyProgress / learningAnalytics?.weeklyGoal) * 100)}%` 
              }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Progress: {Math.round((learningAnalytics?.weeklyProgress / learningAnalytics?.weeklyGoal) * 100)}%</span>
            <span>{learningAnalytics?.weeklyGoal - learningAnalytics?.weeklyProgress}h remaining</span>
          </div>
        </Card>
      </motion.div>

      {/* Skill Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2 text-blue-500" />
            Skill Progress
          </h3>
          
          <div className="space-y-4">
            {learningAnalytics?.skillProgress.map((skill: any, index: number) => (
              <motion.div
                key={skill.skill}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="font-medium w-20">{skill.skill}</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <motion.div
                      className={`h-3 rounded-full ${
                        skill.level >= 80 ? 'bg-green-500' :
                        skill.level >= 60 ? 'bg-blue-500' :
                        skill.level >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.2 * index }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12">{skill.level}%</span>
                </div>
                
                <div className="ml-4">
                  {skill.trend === 'up' && <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />}
                  {skill.trend === 'down' && <ArrowTrendingUpIcon className="w-4 h-4 text-red-500 rotate-180" />}
                  {skill.trend === 'stable' && <div className="w-4 h-4 bg-gray-400 rounded-full" />}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Recent Achievements */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <TrophyIcon className="w-5 h-5 mr-2 text-yellow-500" />
            Recent Achievements
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {learningAnalytics?.recentAchievements.map((achievement: any, index: number) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg"
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <div className="font-medium">{achievement.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(achievement.date).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );

  const renderPersonalizedPaths = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Personalized Learning Paths</h2>
        <p className="text-gray-600 dark:text-gray-400">
          AI-curated paths based on your skills, goals, and learning style
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {personalizedPaths.map((path, index) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="p-6 h-full hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="electric" size="sm">{path.difficulty}</Badge>
                <div className="text-sm text-gray-500">
                  <ClockIcon className="w-4 h-4 inline mr-1" />
                  {path.estimatedTime} weeks
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3">{path.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{path.description}</p>

              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Learning Outcomes:</div>
                <div className="space-y-1">
                  {path.outcomes.slice(0, 3).map((outcome: string, idx: number) => (
                    <div key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      {outcome}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm font-medium mb-2">Courses ({path.courses.length}):</div>
                <div className="flex flex-wrap gap-1">
                  {path.courses.slice(0, 4).map((courseId: string) => (
                    <Badge key={courseId} variant="gray" size="sm">
                      {courseId.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </Badge>
                  ))}
                  {path.courses.length > 4 && (
                    <Badge variant="gray" size="sm">+{path.courses.length - 4} more</Badge>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Progress: {path.progress}%
                </div>
                <Button size="sm" onClick={() => navigate(`/learning-path/${path.id}`)}>
                  {path.progress > 0 ? 'Continue Path' : 'Start Path'}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">AI Recommendations</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Personalized course suggestions based on your learning patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.courseId}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="p-6 h-full hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <Badge 
                  variant={rec.priority === 'high' ? 'red' : rec.priority === 'medium' ? 'yellow' : 'green'} 
                  size="sm"
                >
                  {rec.priority} priority
                </Badge>
                <LightBulbIcon className="w-5 h-5 text-yellow-500" />
              </div>

              <h3 className="font-bold mb-2">{rec.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{rec.reason}</p>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">⏱️ {rec.estimatedTime}</div>
                <Button size="sm" onClick={() => navigate(`/course/${rec.courseId}`)}>
                  <PlayIcon className="w-4 h-4 mr-1" />
                  Start
                </Button>
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
            Advanced Learning Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered personalized learning experience
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
              { key: 'paths', label: 'Learning Paths', icon: '🛤️' },
              { key: 'courses', label: 'Recommendations', icon: '💡' },
              { key: 'progress', label: 'Analytics', icon: '📈' },
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
          {activeTab === 'paths' && renderPersonalizedPaths()}
          {activeTab === 'courses' && renderRecommendations()}
          {activeTab === 'progress' && renderOverview()} {/* Reuse overview for now */}
        </motion.div>
      </div>
    </Layout>
  );
};