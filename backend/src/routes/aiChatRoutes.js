const express = require('express');
const { protect } = require('../middleware/auth');
const aiChatController = require('../controllers/aiChatController');

const router = express.Router();

router.use(protect);

router.post('/chat', aiChatController.chat);
router.post('/chat/stream', aiChatController.chatStream);
router.get('/chat/context', aiChatController.getContext);

module.exports = router;
