const Event = require('../models/Event');

// Controlador para eventos
const eventsController = {
    // Crear un nuevo evento
    createEvent: async (req, res) => {
        try {
            const { title, imageSrc, description, schedule, date, location } = req.body;

            // Validar que todos los campos requeridos estén presentes
            if (!title || !imageSrc || !description || !schedule || !date || !location) {
                return res.status(400).json({ error: 'Todos los campos son requeridos' });
            }

            // Crear el evento
            const newEvent = await Event.create({
                title,
                imageSrc,
                description,
                schedule: Array.isArray(schedule) ? schedule : schedule.split(',').map(item => item.trim()),
                date,
                location
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
                order: [['date', 'DESC']], // Ordenar por fecha, más recientes primero
                raw: true // Obtener objetos planos de JavaScript
            });

            // Asegurarse de que los datos están en el formato correcto
            const formattedEvents = events.map(event => ({
                _id: event.id, // Asegurar que tenemos el id en el formato que espera el frontend
                title: event.title,
                imageSrc: event.imageSrc,
                description: event.description,
                schedule: Array.isArray(event.schedule) ? event.schedule : [],
                date: event.date,
                location: event.location
            }));
<<<<<<< HEAD

            console.log('Eventos encontrados:', formattedEvents); // Log para debugging
=======
>>>>>>> 7447e0be76ee31b506b2cc411ba6f54d0e53143b
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
            const { title, imageSrc, description, schedule, date, location } = req.body;

            const event = await Event.findByPk(id);
            if (!event) {
                return res.status(404).json({ error: 'Evento no encontrado' });
            }

            // Actualizar el evento
            await event.update({
                title: title || event.title,
                imageSrc: imageSrc || event.imageSrc,
                description: description || event.description,
                schedule: schedule ? (Array.isArray(schedule) ? schedule : schedule.split(',').map(item => item.trim())) : event.schedule,
                date: date || event.date,
                location: location || event.location
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