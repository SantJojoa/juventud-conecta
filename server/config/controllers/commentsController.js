const { Comment, User } = require("../models");

const getCommentsByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const comments = await Comment.findAll({
            where: { eventId },
            include: [
                { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] },
                { model: User, as: 'admin', attributes: ['id', 'firstName', 'lastName', 'avatarUrl'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener comentarios', detail: error.message });
    }
};

const createComment = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;
        const { content } = req.body;

        if (!content) return res.status(400).json({ eventId, userId, content });
        const comment = await Comment.create({ eventId, userId, content })
        try {
            const { Notification, User } = require('../models');
            const admins = await User.findAll({ where: { role: 'admin' }, attributes: ['id'] });
            const notifs = admins.map(a => ({
                userId: a.id,
                type: 'new_comment',
                title: 'Nuevo comentario',
                message: `Nuevo comentario en el evento #${eventId}.`,
                meta: { eventId, commentId: comment.id }
            }));
            if (notifs.length) await Notification.bulkCreate(notifs);
        } catch (e) { console.error('Error notificando nuevo comentario:', e); }
        res.status(201).json(comment);
    } catch (error) {
        console.error('Error al crear el comentario', error);
        res.status(500).json({ error: 'Error al crear el comentario', detail: error.message });
    }
};

const replyToComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const adminId = req.user.id;
        const { adminResponse } = req.body;

        const comment = await Comment.findByPk(commentId);
        if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });

        comment.adminResponse = adminResponse;
        comment.adminId = adminId;
        comment.respondedAt = new Date();
        await comment.save();

        try {
            const { Notification } = require('../models');
            await Notification.create({
                userId: comment.userId,
                type: 'comment_replied',
                title: 'Tu comentario fue respondido',
                message: 'Un administrador ha respondido tu comentario.',
                meta: { commentId }
            });
        } catch (e) { console.error('Error notificando respuesta a comentario:', e); }
        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: 'Error al responder al comentario' });
    }
};

module.exports = {
    getCommentsByEvent,
    createComment,
    replyToComment,
};