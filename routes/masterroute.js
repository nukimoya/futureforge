const express = require('express');
const authRoutes = require('./auth.js');
const userroute = require('./user.js')
const testRoutes = require('./test.js');
const careerRoutes = require('./career.js');

const router = express.Router();

router.use("/auth", authRoutes, userroute);
router.use("/api", testRoutes, careerRoutes);


module.exports = router;