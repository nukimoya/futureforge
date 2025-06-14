const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // adjust based on your setup

const AptitudeQuestion = sequelize.define('AptitudeQuestion', {
  question_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  options: {
    type: DataTypes.ARRAY(DataTypes.STRING), // PostgreSQL array of strings
    allowNull: false
  },
  question_type: {
    type: DataTypes.ENUM('logic', 'preference', 'scenario', 'personality', 'interest'),
    allowNull: false
  },
  difficulty_level: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    allowNull: false,
    defaultValue: 'medium'
  },
  category: {
    type: DataTypes.STRING, // e.g. "Tech", "Creativity", "Leadership", etc.
    allowNull: false
  }
}, {
  tableName: 'aptitude_questions',
  timestamps: true // createdAt, updatedAt
});

module.exports = AptitudeQuestion;
