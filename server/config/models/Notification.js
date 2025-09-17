const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');


const Notification = sequelize.define('Notification', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' }, onDelete: 'CASCADE' },
    type: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    meta: { type: DataTypes.JSONB, allowNull: true },
    read: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true });

User.hasMany(Notification, { as: 'notifications', foreignKey: 'userId' });
Notification.belongsTo(User, { as: 'user', foreignKey: 'userId' });

module.exports = Notification;