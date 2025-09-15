const Event = require('../models/Event');

// Controlador para eventos
const eventsController = {
    // Crear un nuevo evento
    createEvent: async (req, res) => {
        try {
            const { title, imageSrc, description, startDate, endDate, startTime, endTime, location, category } = req.body;

            if (!title || !imageSrc || !description || !startDate || !endDate || !startTime || !endTime || !location || !category) {
                return res.status(400).json({ error: 'Todos los campos son requeridos' });
            }

            const newEvent = await Event.create({
                title,
                imageSrc,
                description,
                startDate,
                endDate,
                startTime,
                endTime,
                location,
                category
            });

            res.status(201).json(newEvent);
        } catch (error) {
            console.error('Error al crear evento:', error);
            res.status(500).json({ error: 'Error al crear el evento' });
        }
    },

    // Obtener todos los eventos
    getAllEvents: async (req, res) => {
        try {
            const events = await Event.findAll({
                order: [['createdAt', 'DESC']], // Ordenar por fecha de creación como fallback
                raw: true // Obtener objetos planos de JavaScript
            });

            // Asegurarse de que los datos están en el formato correcto
            const formattedEvents = events.map(event => ({
                _id: event.id, // Asegurar que tenemos el id en el formato que espera el frontend
                title: event.title,
                imageSrc: event.imageSrc,
                description: event.description,
                startDate: event.startDate,
                endDate: event.endDate,
                startTime: event.startTime,
                endTime: event.endTime,
                location: event.location,
                category: event.category
            }));
            res.json(formattedEvents);
        } catch (error) {
            console.error('Error al obtener eventos:', error);
            res.status(500).json({ error: 'Error al obtener los eventos' });
        }
    },

    // Obtener un evento específico
    getEventById: async (req, res) => {
        try {
            const { id } = req.params;
            const event = await Event.findByPk(id);

            if (!event) {
                return res.status(404).json({ error: 'Evento no encontrado' });
            }

            // Incrementar contador de vistas de forma atómica
            try {
                await event.increment('viewsCount');
            } catch (incErr) {
                // No bloquear respuesta por error de métrica
                console.error('No se pudo incrementar viewsCount:', incErr);
            }

            res.json(event);
        } catch (error) {
            console.error('Error al obtener evento:', error);
            res.status(500).json({ error: 'Error al obtener el evento' });
        }
    },

    // Actualizar un evento
    updateEvent: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, imageSrc, description, startDate, endDate, startTime, endTime, location, category } = req.body;

            const event = await Event.findByPk(id);
            if (!event) {
                return res.status(404).json({ error: 'Evento no encontrado' });
            }

            // Actualizar el evento
            await event.update({
                title: title || event.title,
                imageSrc: imageSrc || event.imageSrc,
                description: description || event.description,
                startDate: startDate || event.startDate,
                endDate: endDate || event.endDate,
                startTime: startTime || event.startTime,
                endTime: endTime || event.endTime,
                location: location || event.location,
                category: category || event.category
            });

            res.json(event);
        } catch (error) {
            console.error('Error al actualizar evento:', error);
            res.status(500).json({ error: 'Error al actualizar el evento' });
        }
    },

    // Eliminar un evento
    deleteEvent: async (req, res) => {
        try {
            const { id } = req.params;
            const event = await Event.findByPk(id);

            if (!event) {
                return res.status(404).json({ error: 'Evento no encontrado' });
            }

            await event.destroy();
            res.json({ message: 'Evento eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar evento:', error);
            res.status(500).json({ error: 'Error al eliminar el evento' });
        }
    }
};

module.exports = eventsController;