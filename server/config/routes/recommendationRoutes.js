const express = require('express');
const { getRecommendations } = require('../controllers/recomendationController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/users/:userId/recommendations', authMiddleware, getRecommendations);

module.exports = router;