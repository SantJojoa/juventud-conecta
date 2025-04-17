const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Event = require('./Event');

const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    adminResponse: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    respondedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true
});

Comment.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Comment.belongsTo(Event, { as: 'event', foreignKey: 'eventId' });
Comment.belongsTo(User, { as: 'admin', foreignKey: 'adminId' });

module.exports = Comment;