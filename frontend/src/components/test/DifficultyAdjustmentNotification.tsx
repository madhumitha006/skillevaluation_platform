import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DifficultyAdjustmentProps {
  adjustment: {
    oldDifficulty: string;
    newDifficulty: string;
    feedback: {
      message: string;
      type: 'maintain' | 'increase' | 'decrease' | 'adjust';
      icon: string;
    };
  } | null;
  onClose: () => void;
}

export const DifficultyAdjustmentNotification = ({ adjustment, onClose }: DifficultyAdjustmentProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (adjustment) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [adjustment, onClose]);

  if (!adjustment) return null;

  const getColorClass = () => {
    switch (adjustment.feedback.type) {
      case 'increase':
        return 'from-green-500 to-emerald-600';
      case 'decrease':
        return 'from-orange-500 to-red-600';
      case 'maintain':
        return 'from-blue-500 to-indigo-600';
      default:
        return 'from-electric-500 to-violet-600';
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 max-w-md"
        >
          <div className={`bg-gradient-to-r ${getColorClass()} rounded-2xl p-6 shadow-2xl text-white`}>
            <div className="flex items-center gap-4">
              <div className="text-4xl">{adjustment.feedback.icon}</div>
              <div className="flex-1">
                <div className="font-bold text-lg mb-1">
                  {adjustment.oldDifficulty !== adjustment.newDifficulty
                    ? `Difficulty: ${adjustment.oldDifficulty} → ${adjustment.newDifficulty}`
                    : 'Difficulty Maintained'}
                </div>
                <div className="text-sm opacity-90">{adjustment.feedback.message}</div>
              </div>
            </div>
            
            {adjustment.oldDifficulty !== adjustment.newDifficulty && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3 }}
                className="h-1 bg-white/30 rounded-full mt-4"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
