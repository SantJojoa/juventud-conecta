const sequelize = require("./config/db");
const User = require("./config/models/User");

(async () => {
    try {
        await sequelize.sync(); // Asegura que la BD esté sincronizada

        // Verificar si ya existe un admin
        const existingAdmin = await User.findOne({ where: { email: "admin@example.com" } });
        if (existingAdmin) {
            console.log("⚠️ Un usuario admin ya existe. No se creó uno nuevo.");
            process.exit();
        }

        // Crear usuario admin
        const admin = await User.create({
            name: "Admin",
            email: "admin@example.com",
            password: "adminpassword", // Se encriptará automáticamente en el modelo
            role: "admin",
        });

        console.log("✅ Usuario admin creado:", admin.toJSON());
        process.exit();
    } catch (error) {
        console.error("❌ Error al crear admin:", error);
        process.exit(1);
    }
})();
