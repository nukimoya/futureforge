const express = require('express');
const signupUser = require('../controllers/signupcontroller.js')
const confirm_code = require('../controllers/confirmController.js')
const resend_code = require('../controllers/resendController.js')
const { signinUser } = require('../controllers/signincontroller.js')

const resendCodeLimiter = require('../middleware/ratelimiter.js')
// const signinUser = require('../controllers/authController.js');


const router = express.Router();

router.post("/signup", signupUser);
router.post("/confirm-code", confirm_code)
router.post("/resend-code", resendCodeLimiter, resend_code)
router.post("/login", ...signinUser)

router.post('/logout', (req, res) => {
    res.clearCookie('auth_token');
    res.status(200).json({ msg: 'Logged out successfully' });
});
  

module.exports = router;