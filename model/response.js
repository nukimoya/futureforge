// models/Response.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Response = sequelize.define('Response', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  testSessionId: { type: DataTypes.INTEGER, allowNull: true }, 
  question: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
  answer: { type: DataTypes.TEXT }
  }, {
  timestamps: true,
  tableName: 'responses'
  }
);

module.exports = Response;
