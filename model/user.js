const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.ENUM('student', 'professional'), defaultValue: 'student' },
  confirmation_code: { type: DataTypes.STRING, allowNull: true },
  confirmation_code_expires: { type: DataTypes.DATE, allowNull: true },
  is_confirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true });

module.exports = {User};