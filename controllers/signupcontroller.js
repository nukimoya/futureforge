const bcrypt = require('bcrypt');
const crypto = require('crypto');
const validator = require('validator');
const { validateUsername, validatePassword } = require('../utils/validateme');
const sendConfirmationEmail = require('../utils/sendConfirmationEmail');
const { User } = require('../model/user');

const signupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const validationErrors = [];

    const trimmedUsername = username?.trim();
    const usernameError = validateUsername(trimmedUsername);
    if (usernameError) validationErrors.push(usernameError);

    const trimmedEmail = email?.trim().toLowerCase();
    if (!trimmedEmail || !validator.isEmail(trimmedEmail)) {
      validationErrors.push('Valid email is required');
    }

    const passwordError = validatePassword(password);
    if (passwordError) validationErrors.push(passwordError);

    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', msg: validationErrors });
    }

    const existingUser = await User.findOne({ where: { email: trimmedEmail } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const confirmation_code = crypto.randomInt(100000, 999999).toString();
    const expiryTime = new Date(Date.now() + 60 * 10000); // 1 minute

    const user = await User.create({
      name: trimmedUsername,
      email: trimmedEmail,
      password: hashedPassword,
      confirmation_code,
      confirmation_code_expires: expiryTime,
      is_confirmed: false,
      created_at: new Date()
    });

    await sendConfirmationEmail(trimmedEmail, confirmation_code);

    res.status(201).json({
      message: 'Account created. Please check your email to confirm your account.',
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = signupUser;
