import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Course } from '@/types';

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'green';
      case 'intermediate': return 'yellow';
      case 'advanced': return 'red';
      default: return 'gray';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 h-full flex flex-col space-y-4 hover:shadow-xl transition-shadow">
        <div className="flex justify-between items-start">
          <Badge variant={getDifficultyColor(course.difficulty) as any} size="sm">
            {course.difficulty}
          </Badge>
          <div className="text-sm text-gray-500">
            {course.totalDuration}min
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <h3 className="text-xl font-bold line-clamp-2">{course.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
            {course.description}
          </p>
          
          <div className="flex flex-wrap gap-1">
            {(course.skills || []).slice(0, 3).map((skill) => (
              <Badge key={skill} variant="electric" size="sm">
                {skill}
              </Badge>
            ))}
            {(course.skills || []).length > 3 && (
              <Badge variant="gray" size="sm">
                +{(course.skills || []).length - 3}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="text-sm text-electric-600 font-medium">
              {course.totalXP} XP
            </div>
            <div className="text-sm text-gray-500">
              {(course.modules || []).length} modules
            </div>
          </div>
          
          <Button
            size="sm"
            onClick={() => navigate(`/course/${course._id}`)}
          >
            {course.progress > 0 ? 'Continue Course' : 'Start Course'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};