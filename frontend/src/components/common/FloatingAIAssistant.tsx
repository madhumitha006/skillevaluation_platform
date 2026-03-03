import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIAssistantChat } from './AIAssistantChat';

export const FloatingAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <>
      {/* Premium Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 z-50 w-20 h-20 bg-gradient-to-r from-electric-500 via-blue-600 to-violet-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl hover:shadow-electric-500/50 transition-all duration-500 group"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                repeatDelay: 2,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              
              {/* AI Pulse Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/30"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 0, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
              
              {/* Secondary Pulse */}
              <motion.div
                className="absolute inset-0 rounded-full border border-white/20"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5,
                  ease: "easeOut"
                }}
              />
            </motion.div>
            
            {/* Smart Notification Dot */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ duration: 0.6, delay: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-3 h-3 bg-white rounded-full"
              />
            </motion.div>
            
            {/* Hover Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              whileHover={{ opacity: 1, x: 0, scale: 1 }}
              className="absolute right-full mr-4 px-4 py-2 bg-black/80 backdrop-blur-sm text-white text-sm rounded-xl whitespace-nowrap pointer-events-none"
            >
              Ask SkillNexus AI ✨
              <div className="absolute top-1/2 -right-1 w-2 h-2 bg-black/80 rotate-45 transform -translate-y-1/2" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Premium Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`fixed z-50 ${
              isMinimized 
                ? 'bottom-8 right-8 w-80 h-16' 
                : 'bottom-8 right-8 w-96 h-[600px] md:w-[420px] md:h-[700px]'
            } glass-strong rounded-3xl shadow-3xl border border-white/20 overflow-hidden backdrop-blur-2xl`}
          >
            <AIAssistantChat
              isMinimized={isMinimized}
              onMinimize={() => setIsMinimized(!isMinimized)}
              onClose={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};