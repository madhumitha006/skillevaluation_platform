import { useState, useCallback, useEffect } from 'react';
import aiChatService from '../services/aiChatService';
import { useAuthStore } from '../context/AuthStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [context, setContext] = useState<any>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      aiChatService.setToken(token);
      loadContext();
    }
  }, [token]);

  const loadContext = async () => {
    const ctx = await aiChatService.getUserContext();
    setContext(ctx);
  };

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setIsStreaming(true);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      try {
        await aiChatService.streamMessage(content, context, (chunk) => {
          setMessages((prev) => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg.role === 'assistant') {
              lastMsg.content += chunk;
            }
            return updated;
          });
        });
      } catch (error) {
        console.error('Send message error:', error);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content =
            'Sorry, I encountered an error. Please try again.';
          return updated;
        });
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
      }
    },
    [context]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    isStreaming,
    sendMessage,
    clearMessages,
  };
};
