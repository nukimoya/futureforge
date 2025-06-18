const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const CareerRecommendation = sequelize.define('CareerRecommendation', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  sessionId: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.STRING },  // 'career', 'education', etc.
  title: { type: DataTypes.STRING, allowNull: false },
  summary: { type: DataTypes.TEXT, allowNull: false },
  description: { type: DataTypes.TEXT },
  score: { type: DataTypes.INTEGER },
  category: { type: DataTypes.STRING },
  confidence: { type: DataTypes.INTEGER },
  priority: { type: DataTypes.STRING },
  skills: { type: DataTypes.ARRAY(DataTypes.STRING) }, // Postgres only
  timeframe: { type: DataTypes.STRING },
  icon: { type: DataTypes.STRING },
  actionItems: { type: DataTypes.ARRAY(DataTypes.STRING) }
}, {
    timestamps: true
});


module.exports = CareerRecommendation;