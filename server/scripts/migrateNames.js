require('dotenv').config({ path: '../.env' });
const { Sequelize, DataTypes, Op } = require('sequelize');

// Configurar conexión directa a la base de datos
const sequelize = new Sequelize(
    process.env.DB_NAME || 'juventud-conecta',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: "postgres",
        logging: console.log
    }
);

// Definir modelo User simplificado para la migración
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'Users',
    timestamps: true
});

async function migrateNames() {
    try {
        console.log('Intentando conectar a la base de datos...');
        await sequelize.authenticate();
        console.log('Conexión establecida correctamente.');

        console.log('Buscando usuarios para migrar...');

        // Obtenemos todos los usuarios que tienen name pero no tienen firstName o lastName
        const users = await User.findAll({
            where: {
                name: {
                    [Op.not]: null
                },
                [Op.or]: [
                    { firstName: null },
                    { lastName: null }
                ]
            }
        });

        console.log(`Se encontraron ${users.length} usuarios para migrar.`);

        // Procesar cada usuario
        for (const user of users) {
            console.log(`Migrando usuario ID ${user.id} - Name: ${user.name}`);

            // Dividir el nombre en partes por espacio
            const nameParts = user.name.trim().split(' ');
            let firstName, lastName;

            if (nameParts.length === 1) {
                // Solo hay un nombre
                firstName = nameParts[0];
                lastName = '';
            } else {
                // El último elemento es el apellido, el resto es el nombre
                lastName = nameParts.pop();
                firstName = nameParts.join(' ');
            }

            // Actualizar el usuario
            await user.update({
                firstName,
                lastName
            });
            console.log(`Usuario actualizado: ID=${user.id}, firstName="${firstName}", lastName="${lastName}"`);
        }
        console.log('Migración completada con éxito');
    } catch (error) {
        console.error('Error durante la migración:', error);
    } finally {
        console.log('Cerrando conexión...');
        await sequelize.close();
        console.log('Conexión cerrada.');
    }
}

// Ejecutar la migración
migrateNames();
