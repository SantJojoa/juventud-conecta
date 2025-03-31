const { User } = require("../models");
const bcrypt = require("bcrypt");

// Obtener perfil de usuario
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] } // Excluir la contraseña por seguridad
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

// Actualizar perfil de usuario
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, currentPassword, newPassword } = req.body;
        
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        // Preparar los datos a actualizar
        const updateData = {};
        
        // Actualizar nombre si se proporciona
        if (name) {
            updateData.name = name;
        }
        
        // Actualizar email si se proporciona y es diferente al actual
        if (email && email !== user.email) {
            // Verificar si el email ya está en uso
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({ message: "El email ya está en uso" });
            }
            updateData.email = email;
        }
        
        // Actualizar contraseña si se proporcionan la contraseña actual y la nueva
        if (currentPassword && newPassword) {
            // Verificar que la contraseña actual sea correcta
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "La contraseña actual es incorrecta" });
            }
            
            // Hash de la nueva contraseña
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(newPassword, salt);
        }
        
        // Actualizar el usuario en la base de datos
        await user.update(updateData);
        
        // Devolver los datos actualizados (excluyendo la contraseña)
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

module.exports = {
    getUserProfile,
    updateUserProfile
};
