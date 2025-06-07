const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.ENUM('student', 'professional'), defaultValue: 'student' }
}, { timestamps: true });

module.exports = User;