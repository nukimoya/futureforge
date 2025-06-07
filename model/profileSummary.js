const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const ProfileSummary = sequelize.define('ProfileSummary', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  summary: { type: DataTypes.TEXT }
}, { timestamps: true });

module.exports = ProfileSummary;