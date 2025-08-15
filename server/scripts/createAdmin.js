const readline = require('readline');
const sequelize = require('../config/db');
const User = require('../config/models/User');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync(); // Sincroniza modelos

        const firstName = await ask('Nombre: ');
        const lastName = await ask('Apellido: ');
        const email = await ask('Email: ');
        const password = await ask('Password: ');

        // Verificar si ya existe un usuario con ese email
        const existingAdmin = await User.findOne({ where: { email } });
        if (existingAdmin) {
            console.log('⚠️ Ya existe un usuario con ese email.');
            rl.close();
            await sequelize.close();
            process.exit();
        }

        const admin = await User.create({
            firstName,
            lastName,
            email,
            password, // El modelo hashea automáticamente
            role: 'admin',
        });
        console.log('✅ Usuario admin creado:', admin.toJSON());
    } catch (error) {
        console.error('❌ Error al crear admin:', error);
    } finally {
        rl.close();
        await sequelize.close();
    }
})();
