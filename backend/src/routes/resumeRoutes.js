const express = require('express');
const resumeController = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const upload = require('../config/multer');

const router = express.Router();

router.use(protect);

router.post('/upload', upload.single('resume'), resumeController.uploadResume);
router.get('/profile', resumeController.getSkillProfile);

module.exports = router;
