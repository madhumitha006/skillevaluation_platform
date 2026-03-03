import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { CourseCard } from '@/components/learning/CourseCard';
import { CourseFilters } from '@/components/learning/CourseFilters';
import { LearningPathCard } from '@/components/learning/LearningPathCard';
import { GamificationPanel } from '@/components/learning/GamificationPanel';
import learningService from '@/services/learningService';
import { Course, LearningPath, Gamification } from '@/types';

export const LearningDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [gamification, setGamification] = useState<Gamification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'paths' | 'progress'>('courses');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data to prevent undefined errors
      const mockCourses = [
        {
          _id: '1',
          title: 'JavaScript Fundamentals',
          description: 'Master the core concepts of JavaScript programming',
          difficulty: 'beginner',
          totalDuration: 120,
          progress: 75,
          thumbnail: '/api/placeholder/300/200',
          skills: ['JavaScript', 'ES6', 'DOM'],
          modules: [
            { id: '1', title: 'Variables and Data Types', duration: 30, completed: true },
            { id: '2', title: 'Functions and Scope', duration: 45, completed: true },
            { id: '3', title: 'DOM Manipulation', duration: 45, completed: false }
          ],
          totalXP: 500,
          instructor: 'John Doe',
          rating: 4.8,
          studentsEnrolled: 1250,
          category: 'Programming'
        },
        {
          _id: '2', 
          title: 'React Development Mastery',
          description: 'Build modern web applications with React and hooks',
          difficulty: 'intermediate',
          totalDuration: 180,
          progress: 45,
          thumbnail: '/api/placeholder/300/200',
          skills: ['React', 'JSX', 'Hooks', 'State Management'],
          modules: [
            { id: '1', title: 'React Basics', duration: 60, completed: true },
            { id: '2', title: 'Hooks Deep Dive', duration: 60, completed: false },
            { id: '3', title: 'State Management', duration: 60, completed: false }
          ],
          totalXP: 750,
          instructor: 'Sarah Johnson',
          rating: 4.9,
          studentsEnrolled: 890,
          category: 'Frontend'
        },
        {
          _id: '3',
          title: 'Node.js Backend Development',
          description: 'Create scalable backend applications with Node.js',
          difficulty: 'intermediate',
          totalDuration: 200,
          progress: 0,
          thumbnail: '/api/placeholder/300/200',
          skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
          modules: [
            { id: '1', title: 'Node.js Fundamentals', duration: 50, completed: false },
            { id: '2', title: 'Express Framework', duration: 70, completed: false },
            { id: '3', title: 'Database Integration', duration: 80, completed: false }
          ],
          totalXP: 800,
          instructor: 'Mike Chen',
          rating: 4.7,
          studentsEnrolled: 650,
          category: 'Backend'
        },
        {
          _id: '4',
          title: 'Python for Data Science',
          description: 'Learn Python programming for data analysis and machine learning',
          difficulty: 'beginner',
          totalDuration: 150,
          progress: 20,
          thumbnail: '/api/placeholder/300/200',
          skills: ['Python', 'Pandas', 'NumPy', 'Data Analysis'],
          modules: [
            { id: '1', title: 'Python Basics', duration: 40, completed: true },
            { id: '2', title: 'Data Structures', duration: 50, completed: false },
            { id: '3', title: 'Data Analysis with Pandas', duration: 60, completed: false }
          ],
          totalXP: 600,
          instructor: 'Dr. Lisa Wang',
          rating: 4.6,
          studentsEnrolled: 2100,
          category: 'Data Science'
        },
        {
          _id: '5',
          title: 'Full Stack Web Development',
          description: 'Complete guide to building full stack applications',
          difficulty: 'advanced',
          totalDuration: 300,
          progress: 10,
          thumbnail: '/api/placeholder/300/200',
          skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
          modules: [
            { id: '1', title: 'Frontend Fundamentals', duration: 80, completed: true },
            { id: '2', title: 'Advanced React', duration: 100, completed: false },
            { id: '3', title: 'Backend Development', duration: 120, completed: false }
          ],
          totalXP: 1200,
          instructor: 'Alex Rodriguez',
          rating: 4.9,
          studentsEnrolled: 450,
          category: 'Full Stack'
        },
        {
          _id: '6',
          title: 'Machine Learning Fundamentals',
          description: 'Introduction to machine learning algorithms and applications',
          difficulty: 'intermediate',
          totalDuration: 220,
          progress: 0,
          thumbnail: '/api/placeholder/300/200',
          skills: ['Python', 'Scikit-learn', 'TensorFlow', 'Machine Learning'],
          modules: [
            { id: '1', title: 'ML Basics', duration: 60, completed: false },
            { id: '2', title: 'Supervised Learning', duration: 80, completed: false },
            { id: '3', title: 'Deep Learning Intro', duration: 80, completed: false }
          ],
          totalXP: 900,
          instructor: 'Dr. James Park',
          rating: 4.8,
          studentsEnrolled: 780,
          category: 'AI/ML'
        }
      ];
      
      const mockPaths = [
        {
          _id: '1',
          title: 'Frontend Developer Path',
          description: 'Complete path to become a frontend developer',
          progress: 60,
          totalCourses: 8,
          completedCourses: 5
        }
      ];
      
      const mockGamification = {
        level: 3,
        currentLevelXP: 750,
        nextLevelXP: 1000,
        totalXP: 2750,
        badges: [
          {
            id: '1',
            name: 'First Steps',
            icon: '🏆',
            rarity: 'common'
          }
        ],
        stats: {
          coursesCompleted: 5,
          totalStudyTime: 7200,
          testsCompleted: 12,
          modulesCompleted: 15,
          quizzesCompleted: 8
        },
        streaks: {
          current: 7,
          longest: 15
        },
        achievements: [
          {
            id: '1',
            name: 'First Steps',
            description: 'Complete your first course',
            completed: true,
            unlockedAt: new Date().toISOString()
          }
        ]
      };

      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
      setLearningPaths(mockPaths);
      setGamification(mockGamification);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filters: any) => {
    let filtered = courses;
    
    if (filters.category) {
      filtered = filtered.filter(course => course.category === filters.category);
    }
    if (filters.difficulty) {
      filtered = filtered.filter(course => course.difficulty === filters.difficulty);
    }
    if (filters.duration) {
      const durationMap: { [key: string]: [number, number] } = {
        '< 2 hours': [0, 120],
        '2-5 hours': [120, 300],
        '5-10 hours': [300, 600],
        '10+ hours': [600, Infinity]
      };
      const [min, max] = durationMap[filters.duration] || [0, Infinity];
      filtered = filtered.filter(course => course.totalDuration >= min && course.totalDuration < max);
    }
    if (filters.rating) {
      const minRating = parseFloat(filters.rating.replace('+', ''));
      filtered = filtered.filter(course => course.rating >= minRating);
    }
    
    setFilteredCourses(filtered);
  };

  const handleSearchChange = (search: string) => {
    if (!search) {
      setFilteredCourses(courses);
      return;
    }
    
    const filtered = courses.filter(course => 
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase()) ||
      course.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()))
    );
    
    setFilteredCourses(filtered);
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold">Learning Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and continue your learning journey
          </p>
        </motion.div>

        {/* Gamification Panel */}
        {gamification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GamificationPanel gamification={gamification} />
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="glass rounded-xl p-1 flex gap-1">
            {[
              { key: 'courses', label: 'Courses', icon: '📚' },
              { key: 'paths', label: 'Learning Paths', icon: '🛤️' },
              { key: 'progress', label: 'Progress', icon: '📊' },
            ].map((tab, index) => (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 relative overflow-hidden ${
                  activeTab === tab.key
                    ? 'bg-electric-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeTab === tab.key && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-electric-400 to-violet-500"
                    layoutId="activeTab"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <motion.span 
                  className="relative z-10"
                  animate={{ rotate: activeTab === tab.key ? [0, 10, -10, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {tab.icon}
                </motion.span>
                <span className="relative z-10">{tab.label}</span>
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
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Courses ({filteredCourses.length})</h2>
                <Button variant="secondary">View All Courses</Button>
              </div>
              
              <CourseFilters 
                onFilterChange={handleFilterChange}
                onSearchChange={handleSearchChange}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </div>
              
              {filteredCourses.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No courses found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'paths' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Your Learning Paths</h2>
                <Button>Generate New Path</Button>
              </div>
              {learningPaths.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {learningPaths.map((path, index) => (
                    <motion.div
                      key={path._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <LearningPathCard learningPath={path} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="text-6xl">🎯</div>
                    <h3 className="text-xl font-semibold">No Learning Paths Yet</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Create a personalized learning path based on your goals
                    </p>
                    <Button>Generate Learning Path</Button>
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Learning Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Overall Stats */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Overall Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Courses Completed</span>
                      <Badge variant="electric">{gamification?.stats.coursesCompleted || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Study Time</span>
                      <Badge variant="violet">
                        {Math.round((gamification?.stats.totalStudyTime || 0) / 60)}h
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Streak</span>
                      <Badge variant="green">{gamification?.streaks.current || 0} days</Badge>
                    </div>
                  </div>
                </Card>

                {/* Level Progress */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Level Progress</h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-electric-500">
                        Level {gamification?.level || 1}
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-navy-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-electric-500 to-violet-600 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ 
                          width: `${Math.min(100, Math.max(0, gamification && gamification.nextLevelXP > 0
                            ? (gamification.currentLevelXP / gamification.nextLevelXP) * 100
                            : 0))}%`
                        }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{gamification?.currentLevelXP || 0} XP</span>
                      <span>{gamification?.nextLevelXP || 100} XP</span>
                    </div>
                  </div>
                </Card>

                {/* Recent Achievements */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
                  <div className="space-y-3">
                    {gamification?.achievements
                      .filter(a => a.completed)
                      .slice(0, 3)
                      .map((achievement, index) => (
                        <div key={achievement.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                            🏆
                          </div>
                          <div>
                            <div className="font-medium text-sm">{achievement.name}</div>
                            <div className="text-xs text-gray-600">{achievement.description}</div>
                          </div>
                        </div>
                      )) || (
                      <div className="text-center text-gray-500 py-4">
                        No achievements yet
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};