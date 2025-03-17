const express = require('express');
const Event = require("../models/Event")
const verifyToken = require("../middlewares/verifyToken")

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los datos" });
    }
});

router.post("/", verifyToken, async (req, res) => {

    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Acceso denegado, solo los administradores pueden crear eventos" });
        }

        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el evento" });
    }

});

module.exports = router;