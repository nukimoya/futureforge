const express = require('express');
const { startTestSession, getAptitudeQuestions, submitAptitudeTest, latestRecommendation, resetTest, getUserActivities, getUserStats } = require('../controllers/testController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post("/start-session", authMiddleware, startTestSession);
router.post("/test-questions", authMiddleware, getAptitudeQuestions);
router.post("/submit-test", authMiddleware, submitAptitudeTest);
router.post("/resetTest", authMiddleware, resetTest);
router.post("/userActivities", authMiddleware, getUserActivities);
router.post("/userStats", authMiddleware, getUserStats);
router.get("/recommendations", authMiddleware, latestRecommendation);

module.exports = router;
