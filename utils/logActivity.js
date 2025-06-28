// utils/logActivity.js
const UserActivity  = require('../model/userActivity');

async function logActivity(userId, type, metadata = null) {
  try {
    await UserActivity.create({ userId, type, metadata });
  } catch (err) {
    console.error(`❌ Failed to log activity: ${type}`, err.message);
  }
}

module.exports = logActivity;