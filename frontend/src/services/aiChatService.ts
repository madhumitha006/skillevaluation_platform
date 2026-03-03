import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatContext {
  userId: string;
  recentAssessments?: any[];
  skillProfile?: any;
}

class AIChatService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  async sendMessage(message: string, context?: ChatContext): Promise<string> {
    try {
      const response = await axios.post(
        `${API_URL}/api/ai/chat`,
        { message, context },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.data.response;
    } catch (error) {
      console.error('AI Chat error:', error);
      throw error;
    }
  }

  async streamMessage(
    message: string,
    context: ChatContext,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/ai/chat/stream`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, context }),
      });

      if (!response.ok) throw new Error('Stream failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            try {
              const parsed = JSON.parse(data);
              onChunk(parsed.content);
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream error:', error);
      throw error;
    }
  }

  async getUserContext(): Promise<ChatContext | null> {
    try {
      const response = await axios.get(`${API_URL}/api/ai/chat/context`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      return response.data.data;
    } catch (error) {
      console.error('Context fetch error:', error);
      return null;
    }
  }
}

export default new AIChatService();
