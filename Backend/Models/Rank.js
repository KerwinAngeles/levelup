const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Rank = sequelize.define('Rank', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.ENUM('E', 'D', 'C', 'B', 'A', 'S'),
    allowNull: false,
    defaultValue: 'E',
  },

}, {
  timestamps: true,
  tableName: 'ranks',

});

module.exports = Rank;