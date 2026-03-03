import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { LessonViewer } from '../components/learning/LessonViewer';
import { getCourseContent } from '../data/courseContent';

export const LessonPage = () => {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const [courseContent, setCourseContent] = useState<any>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    const content = getCourseContent(courseId || 'javascript-fundamentals');
    if (content) {
      setCourseContent(content);
      
      // Find current lesson index
      const module = content.modules.find((m: any) => m.id === moduleId);
      if (module) {
        const lessonIndex = module.lessons.findIndex((l: any) => l.id === lessonId);
        if (lessonIndex !== -1) {
          setCurrentLessonIndex(lessonIndex);
        }
      }
    }
  }, [courseId, moduleId, lessonId]);

  const getCurrentModule = () => {
    return courseContent?.modules.find((m: any) => m.id === moduleId);
  };

  const getCurrentLesson = () => {
    const module = getCurrentModule();
    return module?.lessons[currentLessonIndex];
  };

  const handleLessonComplete = () => {
    const lesson = getCurrentLesson();
    if (lesson) {
      setCompletedLessons(prev => new Set([...prev, lesson.id]));
      
      // Auto-advance to next lesson after completion
      setTimeout(() => {
        handleNext();
      }, 1500);
    }
  };

  const handleNext = () => {
    const module = getCurrentModule();
    if (module && currentLessonIndex < module.lessons.length - 1) {
      const nextLesson = module.lessons[currentLessonIndex + 1];
      navigate(`/course/${courseId}/module/${moduleId}/lesson/${nextLesson.id}`);
    } else {
      // Go back to course detail page
      navigate(`/course/${courseId}`);
    }
  };

  const handlePrevious = () => {
    const module = getCurrentModule();
    if (module && currentLessonIndex > 0) {
      const prevLesson = module.lessons[currentLessonIndex - 1];
      navigate(`/course/${courseId}/module/${moduleId}/lesson/${prevLesson.id}`);
    }
  };

  const currentLesson = getCurrentLesson();
  const currentModule = getCurrentModule();

  if (!courseContent || !currentLesson) {
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
      <div className="py-8">
        <LessonViewer
          lesson={currentLesson}
          onComplete={handleLessonComplete}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={currentLessonIndex < (currentModule?.lessons.length || 0) - 1}
          hasPrevious={currentLessonIndex > 0}
        />
      </div>
    </Layout>
  );
};