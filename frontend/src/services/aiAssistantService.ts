import api from './api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface SendMessageData {
  message: string;
  conversationId?: string;
}

class AIAssistantService {
  async sendMessage(data: SendMessageData) {
    const response = await api.post('/assistant/chat', data);
    return response.data;
  }

  async streamMessage(data: SendMessageData, onChunk: (chunk: string) => void, onComplete: () => void) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/assistant/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to stream message');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              onComplete();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.chunk) {
                onChunk(parsed.chunk);
              }
              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      throw error;
    }
  }

  async getConversationHistory(conversationId: string) {
    const response = await api.get(`/assistant/conversations/${conversationId}`);
    return response.data;
  }

  async clearConversation(conversationId: string) {
    const response = await api.delete(`/assistant/conversations/${conversationId}`);
    return response.data;
  }

  async getSuggestions() {
    const response = await api.get('/assistant/suggestions');
    return response.data;
  }
}

export default new AIAssistantService();