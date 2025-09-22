// server/config/routes/recommendationRoutes.js
const express = require('express');
const { getRecommendations } = require('../controllers/recomendationController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Requiere estar logueado; usa el userId del token si prefieres:
router.get('/users/:userId/recommendations', authMiddleware, getRecommendations);

module.exports = router;