import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { 
  PlayIcon, 
  ClockIcon, 
  StarIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  BookOpenIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { getCourseContent } from '../data/courseContent';

export const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [activeModule, setActiveModule] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    // Get actual course content
    const actualContent = getCourseContent('javascript-fundamentals');
    
    const mockCourse = {
      _id: courseId,
      title: actualContent?.title || 'JavaScript Fundamentals',
      description: 'Master the core concepts of JavaScript programming from variables to advanced concepts like closures and async programming.',
      difficulty: 'beginner',
      totalDuration: 120,
      progress: 75,
      thumbnail: '/api/placeholder/600/300',
      skills: ['JavaScript', 'ES6', 'DOM', 'Async Programming'],
      modules: actualContent?.modules.map((module: any, index: number) => ({
        id: module.id,
        title: module.title,
        duration: module.lessons.reduce((total: number, lesson: any) => total + lesson.duration, 0),
        completed: index === 0, // First module completed for demo
        description: `Learn ${module.title.toLowerCase()} concepts and practical applications`,
        lessons: module.lessons.map((lesson: any) => lesson.title)
      })) || [
        { 
          id: '1', 
          title: 'Variables and Data Types', 
          duration: 30, 
          completed: true,
          description: 'Learn about JavaScript variables, data types, and type conversion',
          lessons: ['Introduction to Variables', 'Primitive Data Types', 'Type Conversion', 'Practice Exercises']
        },
        { 
          id: '2', 
          title: 'Functions and Scope', 
          duration: 45, 
          completed: true,
          description: 'Understanding functions, scope, and closures in JavaScript',
          lessons: ['Function Declaration', 'Arrow Functions', 'Scope Chain', 'Closures', 'IIFE']
        },
        { 
          id: '3', 
          title: 'DOM Manipulation', 
          duration: 45, 
          completed: false,
          description: 'Learn to interact with HTML elements using JavaScript',
          lessons: ['DOM Selection', 'Event Handling', 'Dynamic Content', 'Form Validation']
        }
      ],
      totalXP: 500,
      instructor: {
        name: 'John Doe',
        avatar: '/api/placeholder/100/100',
        bio: 'Senior JavaScript Developer with 8+ years of experience',
        rating: 4.8
      },
      rating: 4.8,
      studentsEnrolled: 1250,
      category: 'Programming',
      prerequisites: ['Basic HTML knowledge', 'Computer literacy'],
      learningOutcomes: [
        'Understand JavaScript fundamentals',
        'Work with variables and data types',
        'Create and use functions effectively',
        'Manipulate DOM elements',
        'Handle events and user interactions'
      ]
    };
    
    setCourse(mockCourse);
    setIsEnrolled(Math.random() > 0.5); // Random enrollment status
  }, [courseId]);

  const handleEnroll = () => {
    setIsEnrolled(true);
    // Mock enrollment logic
  };

  const handleStartModule = (moduleIndex: number) => {
    const module = course.modules[moduleIndex];
    const actualContent = getCourseContent('javascript-fundamentals');
    const actualModule = actualContent?.modules[moduleIndex];
    
    if (actualModule && actualModule.lessons.length > 0) {
      // Navigate to first lesson of the module
      const firstLesson = actualModule.lessons[0];
      navigate(`/course/${courseId}/module/${module.id}/lesson/${firstLesson.id}`);
    } else {
      setActiveModule(moduleIndex);
    }
  };

  if (!course) {
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
      <div className="max-w-6xl mx-auto py-8 space-y-8">
        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="electric">{course.category}</Badge>
                <Badge variant={course.difficulty === 'beginner' ? 'green' : course.difficulty === 'intermediate' ? 'yellow' : 'red'}>
                  {course.difficulty}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {course.description}
              </p>
              
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  {course.totalDuration} minutes
                </div>
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {course.rating}
                </div>
                <div className="flex items-center gap-1">
                  <UserGroupIcon className="w-4 h-4" />
                  {course.studentsEnrolled.toLocaleString()} students
                </div>
              </div>
            </div>

            {/* Learning Outcomes */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">What you'll learn</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.learningOutcomes.map((outcome: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{outcome}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Course Content */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Course Content</h3>
              <div className="space-y-4">
                {course.modules.map((module: any, index: number) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      activeModule === index 
                        ? 'border-electric-500 bg-electric-50 dark:bg-electric-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveModule(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          module.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {module.completed ? (
                            <CheckCircleIcon className="w-5 h-5" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {module.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {module.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <ClockIcon className="w-4 h-4" />
                        {module.duration}min
                      </div>
                    </div>
                    
                    {activeModule === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                      >
                        <h5 className="font-medium mb-2">Lessons:</h5>
                        <div className="space-y-2">
                          {module.lessons.map((lesson: string, lessonIndex: number) => {
                            const actualContent = getCourseContent('javascript-fundamentals');
                            const actualModule = actualContent?.modules[index];
                            const actualLesson = actualModule?.lessons[lessonIndex];
                            
                            return (
                              <button
                                key={lessonIndex}
                                onClick={() => {
                                  if (actualLesson && isEnrolled) {
                                    navigate(`/course/${courseId}/module/${module.id}/lesson/${actualLesson.id}`);
                                  }
                                }}
                                className={`flex items-center gap-2 text-sm w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                  isEnrolled ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                                }`}
                                disabled={!isEnrolled}
                              >
                                <PlayIcon className="w-4 h-4 text-electric-500" />
                                <span>{lesson}</span>
                                {actualLesson && (
                                  <Badge variant="electric" size="sm">
                                    {actualLesson.duration}min
                                  </Badge>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        {isEnrolled && (
                          <Button 
                            className="mt-4" 
                            size="sm"
                            onClick={() => handleStartModule(index)}
                          >
                            {module.completed ? 'Review Module' : 'Start Module'}
                          </Button>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card className="p-6 text-center">
              <div className="mb-4">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
              
              {isEnrolled ? (
                <div className="space-y-4">
                  <div className="text-green-600 font-medium">✓ Enrolled</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Progress: {course.progress}%
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-electric-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <Button className="w-full">Continue Learning</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-2xl font-bold text-electric-600">Free</div>
                  <Button className="w-full" onClick={handleEnroll}>
                    Enroll Now
                  </Button>
                </div>
              )}
            </Card>

            {/* Instructor */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Instructor</h3>
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={course.instructor.avatar} 
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-medium">{course.instructor.name}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {course.instructor.rating}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {course.instructor.bio}
              </p>
            </Card>

            {/* Skills */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Skills you'll gain</h3>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill: string) => (
                  <Badge key={skill} variant="electric" size="sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Prerequisites */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Prerequisites</h3>
              <div className="space-y-2">
                {course.prerequisites.map((prereq: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <BookOpenIcon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{prereq}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};