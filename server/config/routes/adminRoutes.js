const express = require('express');
const { getAdminStats } = require('../controllers/adminStatsController');
const { isAdmin } = require('../middlewares/authMiddleware');
const { listUsers, deleteUser } = require('../controllers/adminUsersController');

const router = express.Router();

router.get('/stats', isAdmin, getAdminStats);

router.get('/users', isAdmin, listUsers);
router.delete('/users/:id', isAdmin, deleteUser);

module.exports = router;


