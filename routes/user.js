const express = require('express');
const current_user = require('../controllers/userController');
const authMiddleware = require('../middleware/authwDb')


const router = express.Router();


router.get("/current-user", authMiddleware, current_user)


module.exports = router;