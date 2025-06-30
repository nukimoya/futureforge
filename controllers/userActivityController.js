const UserActivity = require('../model/userActivity');

const getUserActivities = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch more to have buffer for deduplication
    const rawActivities = await UserActivity.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    const uniqueMap = new Map();

    const activities = rawActivities
      .filter((activity) => {
        const key = activity.type;
        if (uniqueMap.has(key)) return false;
        uniqueMap.set(key, true);
        return true;
      })
      .slice(0, 10)
      .map((activity) => {
        const now = new Date();
        const createdAt = new Date(activity.createdAt);
        const diffMs = now - createdAt;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        let timeAgo = '';

        if (diffDays >= 1) {
          timeAgo = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else if (diffHours >= 1) {
          timeAgo = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else {
          timeAgo = `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
        }
        return {
          ...activity.toJSON(), // Convert Sequelize instance to plain object
          timeAgo
        };
      });

    res.json({ activities });
  } catch (err) {
    console.error('❌ Failed to fetch user activities', err);
    res.status(500).json({ error: 'Failed to load activities' });
  }
};

const postUserActivity = async (req, res) => {
  const userId = req.user.id;
  const { type, metadata = {} } = req.body;

  try {
    if (!type) {
      return res.status(400).json({ error: 'Activity type is required.' });
    }

    const newActivity = await UserActivity.create({
      userId,
      type,
      metadata
    });

    res.status(201).json({
      message: 'Activity logged successfully.',
      activity: newActivity
    });
  } catch (err) {
    console.error('❌ Failed to log user activity:', err);
    res.status(500).json({ error: 'Failed to log activity.' });
  }
};

module.exports = { getUserActivities, postUserActivity };
