const express = require('express');
const { getAdminStats } = require('../controllers/adminStatsController');
const { isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/stats', isAdmin, getAdminStats);

module.exports = router;


