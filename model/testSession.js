const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TestSession = sequelize.define('TestSession', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  startedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'started_at'
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
    field: 'completed_at'
  }
}, {
  timestamps: false,
  tableName: 'test_sessions'
});

module.exports = TestSession;