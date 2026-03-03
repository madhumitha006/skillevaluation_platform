import { useState, useCallback, useRef } from 'react';
import aiAssistantService, { ChatMessage } from '@/services/aiAssistantService';

export const useAIAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const streamingMessageRef = useRef<string>('');

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addMessage = useCallback((message: Omit<ChatMessage, 'id'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateMessageId(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  }, []);

  const updateMessage = useCallback((messageId: string, updates: Partial<ChatMessage>) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, ...updates } : msg
    ));
  }, []);

  const sendMessage = useCallback(async (content: string, useStreaming = true) => {
    if (!content.trim()) return;

    setIsLoading(true);
    
    // Add user message
    const userMessageId = addMessage({
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    });

    try {
      if (useStreaming) {
        setIsStreaming(true);
        streamingMessageRef.current = '';
        
        // Add assistant message placeholder
        const assistantMessageId = addMessage({
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString(),
          isStreaming: true,
        });

        await aiAssistantService.streamMessage(
          {
            message: content.trim(),
            conversationId: conversationId || undefined,
          },
          (chunk: string) => {
            streamingMessageRef.current += chunk;
            updateMessage(assistantMessageId, {
              content: streamingMessageRef.current,
              isStreaming: true,
            });
          },
          () => {
            updateMessage(assistantMessageId, {
              content: streamingMessageRef.current,
              isStreaming: false,
            });
            setIsStreaming(false);
            setIsLoading(false);
          }
        );
      } else {
        const response = await aiAssistantService.sendMessage({
          message: content.trim(),
          conversationId: conversationId || undefined,
        });

        addMessage({
          role: 'assistant',
          content: response.data.response,
          timestamp: response.data.timestamp,
        });

        if (response.data.conversationId && !conversationId) {
          setConversationId(response.data.conversationId);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      addMessage({
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [conversationId, addMessage, updateMessage]);

  const clearConversation = useCallback(async () => {
    try {
      if (conversationId) {
        await aiAssistantService.clearConversation(conversationId);
      }
      setMessages([]);
      setConversationId('');
    } catch (error) {
      console.error('Failed to clear conversation:', error);
    }
  }, [conversationId]);

  const loadConversationHistory = useCallback(async (convId: string) => {
    try {
      const response = await aiAssistantService.getConversationHistory(convId);
      const history = response.data.history || [];
      
      const formattedMessages: ChatMessage[] = history.map((msg: any) => ({
        id: generateMessageId(),
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      }));
      
      setMessages(formattedMessages);
      setConversationId(convId);
    } catch (error) {
      console.error('Failed to load conversation history:', error);
    }
  }, []);

  return {
    messages,
    isLoading,
    isStreaming,
    conversationId,
    sendMessage,
    clearConversation,
    loadConversationHistory,
  };
};