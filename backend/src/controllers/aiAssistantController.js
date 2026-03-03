const AIAssistantAgent = require('../agents/aiAssistantAgent');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../config/logger');

class AIAssistantController {
  constructor() {
    this.assistantAgent = new AIAssistantAgent();
  }

  async sendMessage(req, res) {
    try {
      const { message, conversationId } = req.body;
      const userId = req.user.id;

      if (!message || !message.trim()) {
        return ApiResponse.error(res, 'Message is required', 400);
      }

      const response = await this.assistantAgent.generateResponse(
        userId,
        message.trim(),
        conversationId || `conv_${userId}_${Date.now()}`
      );

      logger.info(`AI Assistant response generated for user: ${userId}`);
      
      return ApiResponse.success(res, {
        response,
        conversationId: conversationId || `conv_${userId}_${Date.now()}`,
        timestamp: new Date().toISOString(),
      }, 'Message processed successfully');
    } catch (error) {
      logger.error(`AI Assistant send message error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to process message', 500);
    }
  }

  async streamMessage(req, res) {
    try {
      const { message, conversationId } = req.body;
      const userId = req.user.id;

      if (!message || !message.trim()) {
        return ApiResponse.error(res, 'Message is required', 400);
      }

      // Set up Server-Sent Events
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      });

      const chunks = await this.assistantAgent.streamResponse(
        userId,
        message.trim(),
        conversationId || `conv_${userId}_${Date.now()}`
      );

      // Send chunks with delay to simulate streaming
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        res.write(`data: ${JSON.stringify({ 
          chunk, 
          isComplete: i === chunks.length - 1,
          conversationId: conversationId || `conv_${userId}_${Date.now()}`,
        })}\n\n`);
        
        // Add delay between chunks
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      }

      res.write('data: [DONE]\n\n');
      res.end();

      logger.info(`AI Assistant streaming response completed for user: ${userId}`);
    } catch (error) {
      logger.error(`AI Assistant stream message error: ${error.message}`);
      res.write(`data: ${JSON.stringify({ error: 'Failed to process message' })}\n\n`);
      res.end();
    }
  }

  async getConversationHistory(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.user.id;

      const history = this.assistantAgent.getConversationHistory(conversationId);
      
      return ApiResponse.success(res, {
        history,
        conversationId,
      }, 'Conversation history retrieved');
    } catch (error) {
      logger.error(`Get conversation history error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to retrieve conversation history', 500);
    }
  }

  async clearConversation(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.user.id;

      this.assistantAgent.clearConversation(conversationId);
      
      return ApiResponse.success(res, null, 'Conversation cleared successfully');
    } catch (error) {
      logger.error(`Clear conversation error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to clear conversation', 500);
    }
  }

  async getSuggestions(req, res) {
    try {
      const userId = req.user.id;
      
      // Get context-aware suggestions
      const suggestions = [
        "How can I improve my coding skills?",
        "What courses should I take next?",
        "Help me prepare for technical interviews",
        "Analyze my learning progress",
        "Give me career advice",
        "What are my skill gaps?",
        "How can I stay motivated?",
        "Explain this concept to me",
      ];

      return ApiResponse.success(res, { suggestions }, 'Suggestions retrieved');
    } catch (error) {
      logger.error(`Get suggestions error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to get suggestions', 500);
    }
  }
}

module.exports = new AIAssistantController();