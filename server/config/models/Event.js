const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Event = sequelize.define("Event", {

    id: {
        type: DataTypes.INTEGER,    // Tipo número entero
        primaryKey: true,           // Es la clave primaria
        autoIncrement: true,        // Se incrementa automáticamente
    },
    title: { type: DataTypes.STRING, allowNull: false },
    imageSrc: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    startDate: { type: DataTypes.DATEONLY, allowNull: false },
    endDate: { type: DataTypes.DATEONLY, allowNull: false },
    startTime: { type: DataTypes.TIME, allowNull: false },
    endTime: { type: DataTypes.TIME, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    viewsCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, {
    timestamps: true
});

module.exports = Event;