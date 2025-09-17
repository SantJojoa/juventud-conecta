const { where } = require('sequelize');
const { Notification } = require('../models');

const listMyNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await Notification.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit: 50
        });
        res.json(notifications);
    } catch (e) { res.status(500).json({ error: 'Error al obtener las notificaciones' }); }
};

const markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const notif = await Notification.findByPk({ where: { id, userId } });
        if (!notif) return res.status(404).json({ error: 'Notificación no encontrada' });
        await notif.update({ read: true });
        res.json({ success: true, message: 'Notificación marcada como leída' });
    } catch (e) { res.status(500).json({ error: 'Error al marcar como leído' }); }
};

const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await Notification.update({ read: true }, { where: { userId, read: false } });
        res.json({ success: true, message: 'Todas las notificaciones marcadas como leídas' });
    } catch (e) { res.status(500).json({ error: 'Error al marcar todas como leídas' }); }
};

module.exports = {
    listMyNotifications,
    markAsRead,
    markAllAsRead
};