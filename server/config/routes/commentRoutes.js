const express = require('express');
const commentsController = require('../controllers/commentsController');
const verifyToken = require('../middlewares/verifyToken');
const { isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/event/:eventId', commentsController.getCommentsByEvent);

router.post('/event/:eventId', verifyToken, commentsController.createComment);

router.put('/:commentId/reply', verifyToken, isAdmin, commentsController.replyToComment);

module.exports = router;