const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const EventFormSubmission = require('./EventFormSubmission');
const EventFormQuestion = require('./EventFormQuestion');

const EventFormAnswer = sequelize.define('EventFormAnswer', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    submissionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: EventFormSubmission, key: 'id' },
        onDelete: 'CASCADE',
    },
    questionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: EventFormQuestion, key: 'id' },
        onDelete: 'CASCADE',
    },
    value: { type: DataTypes.TEXT, allowNull: true },

});

EventFormSubmission.hasMany(EventFormAnswer, { as: 'answers', foreignKey: 'submissionId' });
EventFormAnswer.belongsTo(EventFormSubmission, { as: 'submission', foreignKey: 'submissionId' });
EventFormAnswer.belongsTo(EventFormQuestion, { as: 'question', foreignKey: 'questionId' });

module.exports = EventFormAnswer;