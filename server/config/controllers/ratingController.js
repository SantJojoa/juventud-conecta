const UserEventRating = require('../models/UserEventRating'); // Asegúrate de importarlo

async function rateEvent(req, res) {
    try {
        const { userId, rating } = req.body;
        const { eventId } = req.params;

        if (!userId || !rating) {
            return res.status(400).json({ error: "Faltan userId o rating" });
        }

        const [entry, created] = await UserEventRating.findOrCreate({
            where: { userId: userId, eventId: eventId }, // 👈 usar minúsculas, como en el modelo
            defaults: { rating }
        });

        if (!created) {
            entry.rating = rating;
            await entry.save();
        }

        res.json({ message: "Calificación guardada exitosamente", rating: entry.rating });
    } catch (error) {
        console.error('Error al calificar evento:', error);
        res.status(500).json({ error: 'Error al calificar el evento' });
    }
}

module.exports = { rateEvent };
