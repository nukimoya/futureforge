const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const TestSession = sequelize.define('TestSession', {
  id: { 
    type: DataTypes.INTEGER,
     autoIncrement: true,
      primaryKey: true 
    },
  startedAt: { 
    type: DataTypes.DATE,
     defaultValue: DataTypes.NOW 
    },
  completedAt: { 
    type: DataTypes.DATE 
  }
}, { timestamps: true });

module.exports = TestSession;