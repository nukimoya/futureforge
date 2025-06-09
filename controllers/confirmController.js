const { User } = require('../model/user');

const confirmCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    console.log('📥 Confirmation request received:', { email, code });

    if (!email || !code) {
      console.warn('❌ Missing email or code');
      return res.status(400).json({ error: 'Email and confirmation code are required' });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user) {
      console.warn('❌ User not found:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('👤 User found:', { id: user.id, email: user.email });

    if (user.is_confirmed) {
      console.warn('⚠️ Account already confirmed:', user.email);
      return res.status(400).json({ error: 'Account already confirmed' });
    }

    const now = new Date();
    const isCodeMatch = user.confirmation_code === code;
    const isCodeExpired = now > user.confirmation_code_expires;

    if (!isCodeMatch || isCodeExpired) {
      console.warn('❌ Invalid or expired code:', { isCodeMatch, isCodeExpired });
      return res.status(400).json({ error: 'Invalid or expired confirmation code' });
    }

    // Update user record
    user.is_confirmed = true;
    user.confirmation_code = null;
    user.confirmation_code_expires = null;
    await user.save();

    console.log('✅ User confirmed:', user.email);
    res.status(200).json({ message: 'Account successfully confirmed' });

  } catch (error) {
    console.error('🔥 Confirmation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = confirmCode;
