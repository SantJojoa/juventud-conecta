const { User } = require("../models");
const { Event } = require("../models");
const bcrypt = require("bcrypt");

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error al obtener perfil de usuario:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, currentPassword, newPassword } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const updateData = {};

        if (name) {
            updateData.name = name;
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({ message: "El email ya está en uso" });
            }
            updateData.email = email;
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "La contraseña actual es incorrecta" });
            }

            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(newPassword, salt);
        }

        await user.update(updateData);

        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({
            user: updatedUser,
            message: "Perfil actualizado correctamente"
        });
    } catch (error) {
        console.error("Error al actualizar perfil de usuario:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

const addToFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        const { eventId } = req.body;

        if (!eventId) {
            return res.status(400).json({ message: "ID del evento es requerido" });
        }

        const user = await User.findByPk(userId);
        const event = await Event.findByPk(eventId);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" })
        }

        if (!event) {
            return res.status(404).json({ error: "Evento no encontrado" })
        }

        const isFavorite = await user.hasFavoriteEvent(event);

        if (isFavorite) {
            return res.status(400).json({ message: "El evento ya está en favoritos" })
        }

        await user.addFavoriteEvent(event);

        res.status(200).json({ message: "Evento agregado a favoritos exitosamente" });
    } catch (error) {
        console.error('Error al añadir a favoritos', error);
        res.status(500).json({ message: "Error del servidor" });

    }
};

const removeFromFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        const { eventId } = req.params;

        if (!eventId) {
            return res.status(400).json({ message: "ID del evento es requerido" });
        }

        const user = await User.findByPk(userId);
        const event = await Event.findByPk(eventId);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" })
        }

        if (!event) {
            return res.status(404).json({ error: "Evento no encontrado" })
        }

        const isFavorite = await user.hasFavoriteEvent(event);

        if (!isFavorite) {
            return res.status(400).json({ message: "El evento no está en favoritos" })
        }

        await user.removeFavoriteEvent(event);

        res.status(200).json({ message: "Evento removido de favoritos exitosamente" });

    } catch (error) {
        console.error('Error al remover de favoritos', error);
        res.status(500).json({ message: "Error del servidor" });
    }
};

const getFavoriteEvents = async (req, res) => {
    try {

        const userId = req.user.id;
        const user = await User.findByPk(userId, {
            include: [{
                model: Event,
                as: 'favoriteEvents',
                through: { attributes: [] }
            }]
        });

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" })
        }

        const formattedEvents = user.favoriteEvents.map(event => ({
            _id: event.id,
            title: event.title,
            imageSrc: event.imageSrc,
            description: event.description,
            schedule: Array.isArray(event.schedule) ? event.schedule : [],
            date: event.date,
            location: event.location
        }));
        res.status(200).json({ formattedEvents });
    } catch (error) {
        console.error('Error al obtener eventos favoritos', error);
        res.status(500).json({ message: "Error del servidor" });
    }
};


const checkFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { eventId } = req.params;

        if (!eventId) {
            return res.status(400).json({ message: "ID del evento es requerido" });
        }

        const user = await User.findByPk(userId);
        const event = await Event.findByPk(eventId);

        if (!user || !event) {
            return res.status(404).json({ error: "Usuario o evento no encontrado" })
        }

        const isFavorite = await user.hasFavoriteEvent(event);

        res.status(200).json({ isFavorite });
    } catch (error) {
        console.error('Error al verificar evento favorito', error);
        res.status(500).json({ message: "Error del servidor" });
    }
};



module.exports = {
    getUserProfile,
    updateUserProfile,
    addToFavorites,
    removeFromFavorites,
    getFavoriteEvents,
    checkFavorite
};
