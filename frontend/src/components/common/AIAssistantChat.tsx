import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { Button } from '@/components/common/Button';

interface AIAssistantChatProps {
  isMinimized: boolean;
  onMinimize: () => void;
  onClose: () => void;
}

export const AIAssistantChat = ({ isMinimized, onMinimize, onClose }: AIAssistantChatProps) => {
  const { messages, isLoading, isStreaming, sendMessage, clearConversation } = useAIAssistant();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load initial suggestions
    const initialSuggestions = [
      "How can I improve my coding skills?",
      "What courses should I take next?",
      "Help me prepare for interviews",
      "Analyze my learning progress",
    ];
    setSuggestions(initialSuggestions);
  }, []);

  const handleSendMessage = async (message: string) => {
    await sendMessage(message, true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
    setSuggestions([]);
  };

  if (isMinimized) {
    return (
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-electric-500 to-violet-600 text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            🤖
          </div>
          <div>
            <div className="font-semibold text-sm">SkillNexus AI</div>
            <div className="text-xs opacity-90">Ready to help!</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onMinimize}
            className="w-6 h-6 bg-white/20 rounded hover:bg-white/30 transition-colors flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="w-6 h-6 bg-white/20 rounded hover:bg-white/30 transition-colors flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-electric-500 to-violet-600 text-white">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            🤖
          </motion.div>
          <div>
            <div className="font-semibold">SkillNexus AI</div>
            <div className="text-sm opacity-90">Your Learning Assistant</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearConversation}
            className="w-8 h-8 bg-white/20 rounded hover:bg-white/30 transition-colors flex items-center justify-center"
            title="Clear conversation"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={onMinimize}
            className="w-8 h-8 bg-white/20 rounded hover:bg-white/30 transition-colors flex items-center justify-center"
            title="Minimize"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 rounded hover:bg-white/30 transition-colors flex items-center justify-center"
            title="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="text-6xl">👋</div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Hello! I'm your AI Learning Assistant</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                I can help you with learning guidance, skill development, career advice, and more!
              </p>
            </div>
            
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Try asking:
                </div>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </AnimatePresence>

        {(isLoading || isStreaming) && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isLoading || isStreaming}
          placeholder="Ask me anything about learning..."
        />
      </div>
    </div>
  );
};