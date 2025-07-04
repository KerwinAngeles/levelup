const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Award = sequelize.define('Award', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('bloqueado', 'desbloqueado'),
        allowNull: false,
        defaultValue: 'bloqueado',
    },
}, {
    timestamps: true,
    tableName: 'awards',

})

module.exports = Award;