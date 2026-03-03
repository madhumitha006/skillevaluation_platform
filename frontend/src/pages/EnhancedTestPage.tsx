import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { EnhancedTestResults } from '../components/test/EnhancedTestResults';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ClockIcon, 
  TrophyIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { assessmentEngine } from '../services/assessmentEngine';
import { Question, getQuestionsBySkillAndDifficulty, getSkillCategories } from '../data/questionBank';

const skillCategories = getSkillCategories();

const difficultyLevels = [
  { id: 'easy', name: 'Beginner', description: 'Basic concepts and syntax', time: 20, questionCount: 15 },
  { id: 'medium', name: 'Intermediate', description: 'Practical applications', time: 35, questionCount: 25 },
  { id: 'hard', name: 'Advanced', description: 'Complex problem solving', time: 50, questionCount: 35 },
  { id: 'expert', name: 'Expert', description: 'Architecture and optimization', time: 60, questionCount: 40 }
];

export const TestPage = () => {
  const navigate = useNavigate();
  const [testMode, setTestMode] = useState<'setup' | 'testing' | 'complete'>('setup');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [results, setResults] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [adaptiveMode, setAdaptiveMode] = useState(false);
  const [performanceHistory, setPerformanceHistory] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionStats, setQuestionStats] = useState<{[key: string]: {attempts: number, correct: number}}>({});

  const generateQuestions = () => {
    const selectedDifficultyLevel = difficultyLevels.find(d => d.id === selectedDifficulty);
    const questionCount = selectedDifficultyLevel?.questionCount || 20;
    
    let questions;
    if (adaptiveMode) {
      // For adaptive mode, get questions from all difficulties
      questions = getQuestionsBySkillAndDifficulty(
        selectedSkills,
        '', // No difficulty filter for adaptive
        questionCount * 2 // Get more questions for adaptive selection
      );
    } else {
      questions = getQuestionsBySkillAndDifficulty(
        selectedSkills,
        selectedDifficulty,
        questionCount
      );
    }
    
    setQuestions(questions.slice(0, questionCount));
  };

  const startTest = () => {
    if (selectedSkills.length === 0) {
      alert('Please select at least one skill category');
      return;
    }
    if (!adaptiveMode && !selectedDifficulty) {
      alert('Please select a difficulty level or enable adaptive testing');
      return;
    }
    generateQuestions();
    const totalTime = difficultyLevels.find(d => d.id === selectedDifficulty)?.time * 60 || 1200;
    setTimeLeft(totalTime);
    setTestMode('testing');
  };

  useEffect(() => {
    if (testMode !== 'testing') return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testMode]);

  const handleSkillToggle = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
    
    // Track performance for adaptive testing
    const isCorrect = answerIndex === questions[currentQuestion]?.correct;
    const newHistory = [...performanceHistory, isCorrect ? 1 : 0];
    setPerformanceHistory(newHistory);
    
    // Update question stats
    const questionId = questions[currentQuestion]?.id;
    if (questionId) {
      setQuestionStats(prev => ({
        ...prev,
        [questionId]: {
          attempts: (prev[questionId]?.attempts || 0) + 1,
          correct: (prev[questionId]?.correct || 0) + (isCorrect ? 1 : 0)
        }
      }));
    }
    
    // Adaptive difficulty adjustment
    if (adaptiveMode && newHistory.length >= 3) {
      const recentPerformance = newHistory.slice(-3);
      const recentScore = recentPerformance.reduce((a, b) => a + b, 0) / 3;
      
      if (recentScore >= 0.8 && currentDifficultyLevel !== 'expert') {
        // Increase difficulty
        const levels: ('easy' | 'medium' | 'hard' | 'expert')[] = ['easy', 'medium', 'hard', 'expert'];
        const currentIndex = levels.indexOf(currentDifficultyLevel);
        if (currentIndex < levels.length - 1) {
          setCurrentDifficultyLevel(levels[currentIndex + 1]);
        }
      } else if (recentScore <= 0.3 && currentDifficultyLevel !== 'easy') {
        // Decrease difficulty
        const levels: ('easy' | 'medium' | 'hard' | 'expert')[] = ['easy', 'medium', 'hard', 'expert'];
        const currentIndex = levels.indexOf(currentDifficultyLevel);
        if (currentIndex > 0) {
          setCurrentDifficultyLevel(levels[currentIndex - 1]);
        }
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowExplanation(false);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    // Use advanced assessment engine
    const analysisResult = assessmentEngine.analyzePerformance(
      questions,
      answers,
      timeSpent,
      selectedSkills
    );
    
    const testResults = {
      ...analysisResult,
      totalQuestions: questions.length,
      correctAnswers: answers.filter((answer, index) => 
        answer === questions[index]?.correct
      ).length,
      timeSpent: (difficultyLevels.find(d => d.id === selectedDifficulty)?.time * 60 || 1200) - timeLeft,
      difficulty: selectedDifficulty,
      adaptiveMode,
      performanceHistory,
      questionStats,
      completedAt: new Date().toISOString()
    };

    setResults(testResults);
    setTestMode('complete');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (testMode === 'setup') {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <AcademicCapIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Skill Assessment Setup
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Customize your test to match your learning goals
            </p>
          </motion.div>

          <Card className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Select Skills to Test
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {skillCategories.map((skill, index) => (
                <motion.button
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSkillToggle(skill.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedSkills.includes(skill.id)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{skill.icon}</div>
                  <div className="font-medium text-gray-900 dark:text-white">{skill.name}</div>
                  <div className="text-sm text-gray-500">{skill.questions} questions</div>
                </motion.button>
              ))}
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Choose Difficulty Level
            </h2>
            <div className="mb-6">
              <label className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adaptiveMode}
                  onChange={(e) => setAdaptiveMode(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    🧠 Adaptive Testing
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Questions adapt to your performance level
                  </div>
                </div>
              </label>
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 ${adaptiveMode ? 'opacity-50 pointer-events-none' : ''}`}>
              {difficultyLevels.map((level, index) => (
                <motion.button
                  key={level.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onClick={() => setSelectedDifficulty(level.id)}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedDifficulty === level.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-white mb-2">
                    {level.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {level.description}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    ~{level.time} minutes
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                onClick={startTest}
                disabled={selectedSkills.length === 0 || (!adaptiveMode && !selectedDifficulty)}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
              >
                Start Assessment
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  if (testMode === 'complete' && results) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-8 text-center">
              <TrophyIcon className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Assessment Complete! 🎉
              </h2>
              <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                {results.overallScore}%
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                You scored {results.correctAnswers} out of {results.totalQuestions} questions correctly
              </p>

              <EnhancedTestResults results={results} />

              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => {
                    setTestMode('setup');
                    setCurrentQuestion(0);
                    setAnswers([]);
                    setSelectedSkills([]);
                    setSelectedDifficulty('');
                    setAdaptiveMode(false);
                    setPerformanceHistory([]);
                    setQuestionStats({});
                  }}
                  variant="secondary"
                >
                  Take Another Test
                </Button>
                <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700">
                  Continue to Dashboard
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Skill Assessment
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
            <div className="flex items-center text-orange-600 dark:text-orange-400">
              <ClockIcon className="h-5 w-5 mr-2" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          <ProgressBar 
            current={currentQuestion + 1}
            total={questions.length}
            difficulty={questions[currentQuestion]?.difficulty as any}
          />
        </Card>

        {questions[currentQuestion] && (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                  <div className="flex items-center space-x-4">
                    <span>{skillCategories.find(s => s.id === questions[currentQuestion].skill)?.name}</span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-xs">
                      {adaptiveMode ? currentDifficultyLevel : questions[currentQuestion].difficulty}
                    </span>
                    {questions[currentQuestion].tags && (
                      <div className="flex space-x-1">
                        {questions[currentQuestion].tags?.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-600 dark:text-gray-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {adaptiveMode && performanceHistory.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">Performance:</span>
                      <div className="flex space-x-1">
                        {performanceHistory.slice(-5).map((score, idx) => (
                          <div
                            key={idx}
                            className={`w-2 h-2 rounded-full ${
                              score ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {questions[currentQuestion].question}
                </h3>
              </div>

              <div className="space-y-4 mb-8">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      answers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full border-2 border-current mr-3 flex items-center justify-center text-sm font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </div>
                  </motion.button>
                ))}
              </div>

              {showExplanation && questions[currentQuestion].explanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <div className="font-medium text-green-800 dark:text-green-300 mb-2">
                    Explanation:
                  </div>
                  <div className="text-green-700 dark:text-green-400">
                    {questions[currentQuestion].explanation}
                  </div>
                </motion.div>
              )}

              <div className="flex justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                    className="px-6 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Previous
                  </button>
                  
                  {answers[currentQuestion] !== undefined && questions[currentQuestion].explanation && (
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      {showExplanation ? 'Hide' : 'Show'} Explanation
                    </button>
                  )}
                </div>
                
                <Button
                  onClick={handleNext}
                  disabled={answers[currentQuestion] === undefined}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {currentQuestion === questions.length - 1 ? 'Submit Assessment' : 'Next Question'}
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};