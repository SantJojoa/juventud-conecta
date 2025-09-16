const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const EventForm = require('./EventForm');

const EventFormQuestion = sequelize.define('EventFormQuestion', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    formId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: EventForm, key: 'id' },
        onDelete: 'CASCADE',
    },
    label: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('text', 'textarea', 'number', 'select', 'date', 'url', 'email', 'tel'), allowNull: false },
    required: { type: DataTypes.BOOLEAN, defaultValue: false },
    options: { type: DataTypes.JSONB, allowNull: true },
});

EventForm.hasMany(EventFormQuestion, { as: 'questions', foreignKey: 'formId' });
EventFormQuestion.belongsTo(EventForm, { as: 'form', foreignKey: 'formId' });

module.exports = EventFormQuestion;


