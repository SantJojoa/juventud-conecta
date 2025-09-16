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
        onDelete: 'CASCADE',
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    isOpen: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
});

Event.hasOne(EventForm, { foreignKey: 'eventId', as: 'eventForm' });
EventForm.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

module.exports = EventForm;