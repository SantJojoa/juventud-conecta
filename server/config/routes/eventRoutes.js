const express = require('express');
const eventsController = require('../controllers/eventsController');
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

// Rutas públicas - No requieren autenticación
router.get("/", eventsController.getAllEvents);
router.get("/:id", eventsController.getEventById);

// Rutas protegidas - Requieren autenticación y rol de admin
router.post("/", verifyToken, async (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Acceso denegado, solo los administradores pueden crear eventos" });
    }
    next();
}, eventsController.createEvent);

router.put("/:id", verifyToken, async (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Acceso denegado, solo los administradores pueden modificar eventos" });
    }
    next();
}, eventsController.updateEvent);

router.delete("/:id", verifyToken, async (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Acceso denegado, solo los administradores pueden eliminar eventos" });
    }
    next();
}, eventsController.deleteEvent);

module.exports = router;