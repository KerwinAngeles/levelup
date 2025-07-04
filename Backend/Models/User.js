const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false },
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    xp: { type: DataTypes.INTEGER, allowNull: false },
    level: { type: DataTypes.INTEGER, defaultValue: 1 },
    profileImage: { type: DataTypes.STRING, allowNull: true }, 
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
})

module.exports = User;