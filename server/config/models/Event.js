const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Event = sequelize.define("Event", {
    title: { type: DataTypes.STRING, allowNull: false },
    imageSrc: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    endDate: { type: DataTypes.DATEONLY, allowNull: false },
    startTime: { type: DataTypes.TIME, allowNull: false },
    endTime: { type: DataTypes.TIME, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Event;