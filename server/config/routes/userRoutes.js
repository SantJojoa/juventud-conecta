const express = require("express");
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

// Rutas protegidas con verifyToken para asegurar que el usuario esté autenticado
router.get('/profile', verifyToken, userController.getUserProfile);
router.put('/profile', verifyToken, userController.updateUserProfile);

//Rutas para eventos favoritos

router.get('/favorites', verifyToken, userController.getFavoriteEvents);
router.post('/favorites', verifyToken, userController.addToFavorites);
router.delete('/favorites/:eventId', verifyToken, userController.removeFromFavorites);
router.get('/favorites/:eventId/check', verifyToken, userController.checkFavorite)

module.exports = router;
