const express = require("express");
const { getUserProfile, updateUserProfile } = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

// Rutas protegidas con verifyToken para asegurar que el usuario esté autenticado
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);

module.exports = router;
