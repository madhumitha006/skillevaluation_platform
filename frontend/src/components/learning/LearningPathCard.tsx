import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { LearningPath } from '@/types';

interface LearningPathCardProps {
  learningPath: LearningPath;
}

export const LearningPathCard = ({ learningPath }: LearningPathCardProps) => {
  const navigate = useNavigate();

  const completedCourses = learningPath.courses.filter(c => c.status === 'completed').length;
  const totalCourses = learningPath.courses.length;
  const progress = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
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
          <div className="flex items-center gap-2">
            <Badge variant="electric" size="sm">
              {learningPath.difficulty}
            </Badge>
            {learningPath.aiGenerated && (
              <Badge variant="violet" size="sm">
                AI Generated
              </Badge>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {Math.round(learningPath.estimatedDuration)}h
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <h3 className="text-xl font-bold line-clamp-2">{learningPath.title}</h3>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <ProgressBar progress={progress} className="h-2" />
            <div className="text-xs text-gray-500">
              {completedCourses} of {totalCourses} courses completed
            </div>
          </div>

          {/* Target Skills */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Target Skills:</div>
            <div className="flex flex-wrap gap-1">
              {learningPath.targetSkills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="electric" size="sm">
                  {skill}
                </Badge>
              ))}
              {learningPath.targetSkills.length > 4 && (
                <Badge variant="gray" size="sm">
                  +{learningPath.targetSkills.length - 4}
                </Badge>
              )}
            </div>
          </div>

          {/* Skill Gaps */}
          {learningPath.skillGaps.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Priority Gaps:</div>
              <div className="space-y-1">
                {learningPath.skillGaps.slice(0, 3).map((gap) => (
                  <div key={gap.skill} className="flex justify-between items-center text-sm">
                    <span>{gap.skill}</span>
                    <Badge variant={getPriorityColor(gap.priority) as any} size="sm">
                      {gap.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <Badge 
            variant={learningPath.status === 'active' ? 'green' : 'gray'} 
            size="sm"
          >
            {learningPath.status}
          </Badge>
          
          <Button
            size="sm"
            onClick={() => navigate(`/learning/paths/${learningPath._id}`)}
          >
            Continue Learning
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};