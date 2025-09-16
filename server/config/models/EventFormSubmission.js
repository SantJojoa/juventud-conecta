const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const EventForm = require('./EventForm');
const User = require('./User');

const EventFormSubmission = sequelize.define('EventFormSubmission', {
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
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: User, key: 'id' },
        onDelete: 'CASCADE',
    },
    status: { type: DataTypes.ENUM('pending', 'accepted', 'rejected'), defaultValue: 'pending' },

});

EventForm.hasMany(EventFormSubmission, { as: 'submissions', foreignKey: 'formId' });
EventFormSubmission.belongsTo(EventForm, { as: 'form', foreignKey: 'formId' });
EventFormSubmission.belongsTo(User, { as: 'user', foreignKey: 'userId' });

module.exports = EventFormSubmission;