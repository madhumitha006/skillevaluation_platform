import { useState, useEffect } from 'react';
import { useTestSocket } from '../../hooks/useSocket';
import { motion } from 'framer-motion';

interface TestProgressProps {
  testId: string;
  currentQuestion: number;
  totalQuestions: number;
}

export const TestProgressTracker = ({
  testId,
  currentQuestion,
  totalQuestions,
}: TestProgressProps) => {
  const { sendProgress } = useTestSocket(testId);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const newProgress = Math.round((currentQuestion / totalQuestions) * 100);
    setProgress(newProgress);
    
    // Send progress update to server
    sendProgress(currentQuestion, totalQuestions);
  }, [currentQuestion, totalQuestions, sendProgress]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Test Progress
          </h3>
          <p className="text-sm text-gray-500">
            Question {currentQuestion} of {totalQuestions}
          </p>
        </div>
        <div className="text-3xl font-bold text-blue-600">{progress}%</div>
      </div>

      <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        Live tracking enabled
      </div>
    </div>
  );
};

interface LiveTestMonitorProps {
  role: 'recruiter' | 'admin';
}

export const LiveTestMonitor = ({ role }: LiveTestMonitorProps) => {
  const [activeTests, setActiveTests] = useState<any[]>([]);
  const { on, off } = useTestSocket();

  useEffect(() => {
    const handleProgressUpdate = (data: any) => {
      setActiveTests((prev) => {
        const index = prev.findIndex((t) => t.testId === data.testId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = { ...updated[index], ...data };
          return updated;
        }
        return [...prev, data];
      });
    };

    const handleTestStarted = (data: any) => {
      setActiveTests((prev) => [...prev, { ...data, progress: 0 }]);
    };

    const handleTestCompleted = (data: any) => {
      setActiveTests((prev) => prev.filter((t) => t.testId !== data.testId));
    };

    on('test:progress:update', handleProgressUpdate);
    on('test:started:recruiter', handleTestStarted);
    on('test:completed:recruiter', handleTestCompleted);

    return () => {
      off('test:progress:update', handleProgressUpdate);
      off('test:started:recruiter', handleTestStarted);
      off('test:completed:recruiter', handleTestCompleted);
    };
  }, [on, off]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          🔴 Live Tests
        </h2>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          {activeTests.length} Active
        </span>
      </div>

      <div className="space-y-4">
        {activeTests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No active tests at the moment
          </div>
        ) : (
          activeTests.map((test) => (
            <motion.div
              key={test.testId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    User ID: {test.userId?.slice(-8)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Test ID: {test.testId}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {test.progress}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {test.questionIndex}/{test.totalQuestions}
                  </div>
                </div>
              </div>

              <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${test.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="mt-2 text-xs text-gray-500">
                Last update: {new Date(test.timestamp).toLocaleTimeString()}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
