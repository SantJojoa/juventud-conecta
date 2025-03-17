const express = require('express');
const Event = require("../models/Event")

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los eventos" });
    }
});

router.post("/", async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el evento" });
    }
});

module.exports = router;