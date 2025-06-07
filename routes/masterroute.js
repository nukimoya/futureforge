const express = require('express');
const authRoutes = require('./auth.js');

const router = express.Router();

router.use("/auth", authRoutes);
// router.use("/learner", learnerRoutes);


module.exports = router;