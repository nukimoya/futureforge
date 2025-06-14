const express = require('express');
const { User } = require('../model/user');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const { generateToken } = require('../utils/jwt'); // Assumes jwt utils file is setup
require('dotenv').config();

// Constants
const LOGIN_DELAY = 1000; // 1 second delay for brute-force protection

// Rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many login attempts. Please try again later.' }
});

// Format user object for response
const formatUserResponse = (user) => ({
  id: user.id,
  username: user.name,
  email: user.email,
  role: user.role,
  takentest: user.hasTakenAssessment,
});

// Sign-in Controller
const signinUser = async (req, res) => {
  const startTime = Date.now();

  try {
    const { email, password } = req.body;
    const trimmedEmail = email?.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({
      where: { email: trimmedEmail },
      attributes: ['id', 'name', 'email', 'password', 'role', 'hasTakenAssessment', 'is_confirmed']
    });

    const isPasswordValid = user ? await bcrypt.compare(password, user.password) : false;

    // Add a slight delay to prevent brute-force timing attacks
    const elapsed = Date.now() - startTime;
    await new Promise(resolve => setTimeout(resolve, Math.max(0, LOGIN_DELAY - elapsed)));

    if (!user || !isPasswordValid) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    if (!user.is_confirmed) {
      return res.status(200).json({
        requiresVerification: true,
        data: {
          user: {
            email: user.email
          }
        },
        msg: 'Please confirm your email before logging in'
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // Set token as cookie (optional for frontend use)
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      data: {
        user: formatUserResponse(user),
        token
      },
      requiresVerification: false,
      msg: 'Sign-in successful'
    });

  } catch (error) {
    console.error('Signin error:', error);

    if (error.name === 'SequelizeConnectionError') {
      return res.status(503).json({ error: 'Service temporarily unavailable' });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};


// Export as array for use with route middleware
module.exports = {
  signinUser: [loginLimiter, signinUser]
};
