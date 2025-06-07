const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const Feedback = sequelize.define('Feedback', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  rating: { type: DataTypes.INTEGER },
  comment: { type: DataTypes.TEXT }
}, { timestamps: true });

module.exports = Feedback;