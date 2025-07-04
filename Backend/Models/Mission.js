const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Mission = sequelize.define('Mission', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    statTarget: {
        type: DataTypes.ENUM(
            'Push_Ups',
            'Sit_Ups',
            'Pull_Ups',
            'Plank',
            'Squats',
            'Running',
            'Jogging'
        ),
        allowNull: false,
        defaultValue: 'Push_Ups'
    },
    xp_reward: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
    },
    status: {
        type: DataTypes.ENUM('pendiente', 'completada', 'fallida'),
        allowNull: false,
        defaultValue: 'pendiente',
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: 'missions',

})

module.exports = Mission;