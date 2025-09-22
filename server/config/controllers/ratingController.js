const UserEventRating = require('../models/UserEventRating'); // Asegúrate de importarlo

async function rateEvent(req, res) {
    try {
        const { rating } = req.body;
        const { eventId } = req.params;
        const userId = req.user.id;



        if (!eventId || !rating) {
            return res.status(400).json({ error: "Faltan eventId o rating" });
        }

        const [entry, created] = await UserEventRating.findOrCreate({
            where: { userId: userId, eventId: eventId }, // 👈 usar minúsculas, como en el modelo
            defaults: { rating }
        });

        if (!created) {
            entry.rating = rating;
            await entry.save();
        }

        const allRatings = await UserEventRating.findAll({ where: { eventId } });
        const average = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

        try {
            const { Notification } = require('../models');
            await Notification.create({
                userId,
                type: 'rating_saved',
                title: '¡Gracias por tu calificación!',
                message: `Guardamos tu calificación (${rating}) para el evento #${eventId}.`,
                meta: { eventId, rating }
            });
        } catch (e) { console.error('Error notificando calificación:', e); }
        res.json({ message: "Calificación guardada exitosamente", rating: entry.rating, average });
    } catch (error) {
        console.error('Error al calificar evento:', error);
        res.status(500).json({ error: 'Error al calificar el evento' });
    }

}

async function getUserRating(req, res) {
    try {
        const userId = req.user.id;
        const { eventId } = req.params;

        const ratingEntry = await UserEventRating.findOne({ where: { userId, eventId } });

        const allRatings = await UserEventRating.findAll({ where: { eventId } });
        const average = allRatings.length
            ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
            : 0;

        if (!ratingEntry) {
            return res.json({ rating: 0 }); // o null si quieres
        }

        res.json({ rating: ratingEntry ? ratingEntry.rating : 0, average });

    } catch (error) {
        console.error('Error al obtener calificación del evento:', error);
        res.status(500).json({ error: 'Error al obtener la calificación del evento' });
    }
}

module.exports = { rateEvent, getUserRating };
