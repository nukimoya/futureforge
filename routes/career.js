const express = require('express');
const {  latestRecommendation, reportDownload, getUserStats } = require('../controllers/testController');
const { postUserActivity, getUserActivities } = require('../controllers/userActivityController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get("/userStats", authMiddleware, getUserStats);
router.get("/recommendations", authMiddleware, latestRecommendation);
router.post("/reportDownload", authMiddleware, reportDownload);
router.get("/userActivities", authMiddleware, getUserActivities);
router.post("/puserActivities", authMiddleware, postUserActivity);



module.exports = router;
