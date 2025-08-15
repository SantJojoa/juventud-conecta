// Script para crear la tabla de eventos según el modelo actual
const sequelize = require('../config/db');
const Event = require('../config/models/Event');

async function migrate() {
    try {
        await sequelize.authenticate();
        console.log('Conexión establecida correctamente.');
        await Event.sync({ alter: true });
        console.log('Tabla Event migrada (creada o actualizada) correctamente.');
        process.exit(0);
    } catch (error) {
        console.error('Error en la migración:', error);
        process.exit(1);
    }
}

migrate();
