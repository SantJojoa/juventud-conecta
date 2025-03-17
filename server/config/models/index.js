const sequelize = require('../db'); // Importa la conexión a la base de datos
const User = require('./User'); // Importa el modelo de usuario

// Sincroniza los modelos con la BD
const initModels = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("✅ Modelos sincronizados con la base de datos");
    } catch (error) {
        console.error("🚨 Error al sincronizar modelos:", error);
    }
};

module.exports = {
    sequelize,
    User,
    initModels
};
