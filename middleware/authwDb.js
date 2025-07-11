const jwt = require('jsonwebtoken');
const { User } = require('../model/user');

const authMiddleware = async (req, res, next) => {
  const token = (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  console.log('🔐 Incoming Request to:', req.originalUrl);
  console.log('🧾 Token (shortened):', token ? token.substring(0, 20) + '...' : 'No token provided');

  if (!token) {
    console.warn('⚠️ No token found in request headers or cookies');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token successfully decoded:', decoded);

    if (!decoded.id) {
      console.error('❌ Token does not contain a valid user ID');
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'username', 'email', 'role', 'takentest'],
    });

    if (!user) {
      console.warn(`❌ No user found in database for ID: ${decoded.id}`);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`✅ Authenticated user: ${user.email} (ID: ${user.id})`);
    req.user = user;
    next();
  } catch (err) {
    console.error('❌ JWT verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
