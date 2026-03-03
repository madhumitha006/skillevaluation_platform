const express = require('express');
const { body } = require('express-validator');
const aiAssistantController = require('../controllers/aiAssistantController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Send message to AI assistant
router.post(
  '/chat',
  [
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('conversationId').optional().isString().withMessage('Conversation ID must be a string'),
    validate,
  ],
  aiAssistantController.sendMessage
);

// Stream message to AI assistant
router.post(
  '/chat/stream',
  [
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('conversationId').optional().isString().withMessage('Conversation ID must be a string'),
    validate,
  ],
  aiAssistantController.streamMessage
);

// Get conversation history
router.get('/conversations/:conversationId', aiAssistantController.getConversationHistory);

// Clear conversation
router.delete('/conversations/:conversationId', aiAssistantController.clearConversation);

// Get suggested questions
router.get('/suggestions', aiAssistantController.getSuggestions);

module.exports = router;