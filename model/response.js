const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const Response = sequelize.define('Response', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  question: { type: DataTypes.TEXT },
  answer: { type: DataTypes.TEXT }
}, { timestamps: true });

module.exports = Response;
