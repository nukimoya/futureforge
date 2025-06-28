const express = require('express');
const { startTestSession, getAptitudeQuestions, submitAptitudeTest, resetTest } = require('../controllers/testController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post("/start-session", authMiddleware, startTestSession);
router.post("/test-questions", authMiddleware, getAptitudeQuestions);
router.post("/submit-test", authMiddleware, submitAptitudeTest);
router.post("/resetTest", authMiddleware, resetTest);


module.exports = router;
