import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { 
  PlayIcon, 
  CheckCircleIcon, 
  ClockIcon,
  CodeBracketIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { LessonContent, CodeExample, QuizQuestion, Exercise } from '../../data/courseContent';

interface LessonViewerProps {
  lesson: LessonContent;
  onComplete: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export const LessonViewer = ({ 
  lesson, 
  onComplete, 
  onNext, 
  onPrevious, 
  hasNext, 
  hasPrevious 
}: LessonViewerProps) => {
  const [currentSection, setCurrentSection] = useState<'content' | 'examples' | 'quiz' | 'exercise'>('content');
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number}>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [exerciseCode, setExerciseCode] = useState('');
  const [exerciseResults, setExerciseResults] = useState<{passed: boolean, message: string}[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [codeOutput, setCodeOutput] = useState<string>('');

  useEffect(() => {
    if (lesson.exercise) {
      setExerciseCode(lesson.exercise.starterCode);
    }
  }, [lesson]);

  const runCode = (code: string) => {
    try {
      // Capture console.log output
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(arg => String(arg)).join(' '));
      };

      // Execute code
      eval(code);
      
      // Restore console.log
      console.log = originalLog;
      
      setCodeOutput(logs.join('\n') || 'Code executed successfully (no output)');
    } catch (error) {
      setCodeOutput(`Error: ${error}`);
    }
  };

  const runExerciseTests = () => {
    if (!lesson.exercise) return;

    try {
      // Execute the user's code
      eval(exerciseCode);
      
      const results = lesson.exercise.tests.map(test => {
        try {
          const passed = eval(test);
          return {
            passed,
            message: passed ? `✓ ${test}` : `✗ ${test}`
          };
        } catch (error) {
          return {
            passed: false,
            message: `✗ ${test} - Error: ${error}`
          };
        }
      });
      
      setExerciseResults(results);
      
      // Check if all tests passed
      if (results.every(r => r.passed)) {
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    } catch (error) {
      setExerciseResults([{
        passed: false,
        message: `Code execution error: ${error}`
      }]);
    }
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
    
    // Check if all questions are answered correctly
    const allCorrect = lesson.quiz?.every(q => quizAnswers[q.id] === q.correct) || false;
    
    if (allCorrect) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const renderContent = () => {
    // Convert markdown-like content to HTML
    const formatContent = (content: string) => {
      return content
        .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
        .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>')
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4"><code>$2</code></pre>')
        .replace(/\n\n/g, '</p><p class="mb-4">')
        .replace(/^\s*-\s+(.*)$/gm, '<li class="ml-4">• $1</li>');
    };

    return (
      <div 
        className="prose prose-gray dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ 
          __html: `<p class="mb-4">${formatContent(lesson.content)}</p>` 
        }}
      />
    );
  };

  const renderCodeExamples = () => {
    if (!lesson.codeExamples?.length) return null;

    return (
      <div className="space-y-6">
        {lesson.codeExamples.map((example, index) => (
          <Card key={example.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{example.title}</h3>
              <Badge variant="electric">{example.language}</Badge>
            </div>
            
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4">
              <code>{example.code}</code>
            </pre>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {example.explanation}
            </p>
            
            {example.runnable && (
              <div className="space-y-4">
                <Button 
                  onClick={() => runCode(example.code)}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Run Code
                </Button>
                
                {codeOutput && (
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded border-l-4 border-blue-500">
                    <div className="text-sm font-medium mb-1">Output:</div>
                    <pre className="text-sm whitespace-pre-wrap">{codeOutput}</pre>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  const renderQuiz = () => {
    if (!lesson.quiz?.length) return null;

    return (
      <div className="space-y-6">
        {lesson.quiz.map((question, qIndex) => (
          <Card key={question.id} className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Question {qIndex + 1}: {question.question}
            </h3>
            
            <div className="space-y-3">
              {question.options.map((option, oIndex) => {
                const isSelected = quizAnswers[question.id] === oIndex;
                const isCorrect = oIndex === question.correct;
                const showResult = quizSubmitted;
                
                return (
                  <button
                    key={oIndex}
                    onClick={() => !quizSubmitted && setQuizAnswers(prev => ({
                      ...prev,
                      [question.id]: oIndex
                    }))}
                    disabled={quizSubmitted}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                      showResult
                        ? isCorrect
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : isSelected
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                        : isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && isCorrect && (
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            
            {quizSubmitted && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                  Explanation:
                </div>
                <div className="text-blue-700 dark:text-blue-400">
                  {question.explanation}
                </div>
              </div>
            )}
          </Card>
        ))}
        
        {!quizSubmitted && (
          <Button 
            onClick={submitQuiz}
            disabled={Object.keys(quizAnswers).length !== lesson.quiz.length}
            className="w-full"
          >
            Submit Quiz
          </Button>
        )}
        
        {quizSubmitted && (
          <div className="text-center">
            <div className={`text-lg font-semibold mb-2 ${
              lesson.quiz.every(q => quizAnswers[q.id] === q.correct)
                ? 'text-green-600'
                : 'text-orange-600'
            }`}>
              {lesson.quiz.every(q => quizAnswers[q.id] === q.correct)
                ? '🎉 Perfect Score!'
                : '📚 Review the explanations and try again in practice mode'
              }
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderExercise = () => {
    if (!lesson.exercise) return null;

    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">{lesson.exercise.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {lesson.exercise.description}
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Code:</label>
              <textarea
                value={exerciseCode}
                onChange={(e) => setExerciseCode(e.target.value)}
                className="w-full h-64 p-3 font-mono text-sm bg-gray-900 text-green-400 rounded-lg border border-gray-600"
                placeholder="Write your code here..."
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={runExerciseTests} className="bg-blue-600 hover:bg-blue-700">
                Run Tests
              </Button>
              
              <Button 
                onClick={() => setShowHints(!showHints)}
                variant="secondary"
              >
                <LightBulbIcon className="w-4 h-4 mr-2" />
                {showHints ? 'Hide' : 'Show'} Hints
              </Button>
            </div>
            
            {showHints && (
              <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20">
                <h4 className="font-medium mb-2">💡 Hints:</h4>
                <ul className="space-y-1">
                  {lesson.exercise.hints.map((hint, index) => (
                    <li key={index} className="text-sm">• {hint}</li>
                  ))}
                </ul>
              </Card>
            )}
            
            {exerciseResults.length > 0 && (
              <Card className="p-4">
                <h4 className="font-medium mb-2">Test Results:</h4>
                <div className="space-y-1">
                  {exerciseResults.map((result, index) => (
                    <div 
                      key={index}
                      className={`text-sm font-mono ${
                        result.passed ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {result.message}
                    </div>
                  ))}
                </div>
                
                {exerciseResults.every(r => r.passed) && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                    <div className="text-green-800 dark:text-green-300 font-semibold">
                      🎉 All tests passed! Great job!
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        </Card>
      </div>
    );
  };

  const sections = [
    { key: 'content', label: 'Content', icon: '📖' },
    ...(lesson.codeExamples?.length ? [{ key: 'examples', label: 'Examples', icon: '💻' }] : []),
    ...(lesson.quiz?.length ? [{ key: 'quiz', label: 'Quiz', icon: '❓' }] : []),
    ...(lesson.exercise ? [{ key: 'exercise', label: 'Exercise', icon: '🛠️' }] : [])
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                {lesson.duration} minutes
              </div>
              <Badge variant="electric">{lesson.type}</Badge>
            </div>
          </div>
        </div>
        
        {/* Section Navigation */}
        <div className="flex gap-2 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setCurrentSection(section.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                currentSection === section.key
                  ? 'bg-electric-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {section.icon} {section.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Content */}
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {currentSection === 'content' && (
          <Card className="p-6">
            {renderContent()}
          </Card>
        )}
        
        {currentSection === 'examples' && renderCodeExamples()}
        {currentSection === 'quiz' && renderQuiz()}
        {currentSection === 'exercise' && renderExercise()}
      </motion.div>

      {/* Navigation */}
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <Button
            onClick={onPrevious}
            disabled={!hasPrevious}
            variant="secondary"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Previous Lesson
          </Button>
          
          <div className="flex gap-2">
            <Button onClick={onComplete} variant="secondary">
              Mark Complete
            </Button>
            
            {hasNext && (
              <Button onClick={onNext}>
                Next Lesson
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};