const crypto = require('crypto');
const sendConfirmationEmail = require('../utils/sendConfirmationEmail');
const { User } = require('../model/user');

const resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isConfirmed) {
      return res.status(400).json({ error: 'Account is already confirmed' });
    }

    const newCode = crypto.randomInt(100000, 999999).toString();
    const newExpiry = new Date(Date.now() + 60 * 1000); // 1 min

    user.confirmation_code = newCode;
    user.confirmation_code_expires = newExpiry;
    await user.save();

    await sendConfirmationEmail(user.email, newCode);

    res.status(200).json({ message: 'A new confirmation code has been sent to your email' });

  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = resendCode;
