const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Event = sequelize.define("Event", {
    title: { type: DataTypes.STRING, allowNull: false },
    imageSrc: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    schedule: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: true, defaultValue: DataTypes.NOW },
    location: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Event;