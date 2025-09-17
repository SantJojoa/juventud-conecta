const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { listMyNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');


const router = express.Router();
router.get('/', authMiddleware, listMyNotifications);
router.patch('/:id/read', authMiddleware, markAsRead);
router.patch('/read-all', authMiddleware, markAllAsRead);

module.exports = router;