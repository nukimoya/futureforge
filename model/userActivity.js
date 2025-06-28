const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserActivity = sequelize.define('UserActivity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(
        'test_started',
        'test_completed',
        'top_recommendation_changed',
        'recommendation_viewed',
        'report_downloaded'
      ),
      allowNull: false
    },
    metadata: {
      type: DataTypes.JSONB, // Optional: store extra context like recommendation title or session ID
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    updatedAt: false, // We don't need updatedAt for logs
    tableName: 'user_activities'
});

module.exports = UserActivity;