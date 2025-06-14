const express = require('express');
const authRoutes = require('./auth.js');
const testRoutes = require('./test.js');
const careerRoutes = require('./career.js');

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/api", testRoutes, careerRoutes);
// router.use("/learner", learnerRoutes);


module.exports = router;