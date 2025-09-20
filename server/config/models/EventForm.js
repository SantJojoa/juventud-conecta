const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Event = require('./Event');

const EventForm = sequelize.define('EventForm', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: Event, key: 'id' },
        onDelete: 'CASCADE'
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    isOpen: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
});

Event.hasOne(EventForm, { as: 'form', foreignKey: 'eventId' });
EventForm.belongsTo(Event, { as: 'event', foreignKey: 'eventId' });

module.exports = EventForm;