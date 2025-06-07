const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const Career = sequelize.define('Career', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT }
}, { timestamps: false });

module.exports = Career;