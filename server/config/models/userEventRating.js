// models/UserEventRating.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Event = require('./Event');

const UserEventRating = sequelize.define('UserEventRating', {
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    eventId: {
        type: DataTypes.INTEGER, // 👈 igual que en la migración
        allowNull: false,
        references: {
            model: Event,
            key: 'id',
        },
    },
});

// Relaciones
User.belongsToMany(Event, {
    through: UserEventRating,
    as: 'ratedEvents',
    foreignKey: 'userId',
    otherKey: 'eventId'
});
Event.belongsToMany(User, {
    through: UserEventRating,
    as: 'ratedBy',
    foreignKey: 'eventId',
    otherKey: 'userId'
});

module.exports = UserEventRating;
