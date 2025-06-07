const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const CareerRecommendation = sequelize.define('CareerRecommendation', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  matchScore: { type: DataTypes.FLOAT }
}, { timestamps: true });

module.exports = CareerRecommendation;