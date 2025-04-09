const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { where } = require("sequelize");
const { isAdmin } = require("../middlewares/authMiddleware");
const { sendWelcomeEmail, sendAdminWelcomeEmail } = require("../services/sendEmail");

const router = express.Router();

router.post('/register-admin', isAdmin, async (req, res) => {
    const { firstName, lastName, birthDate, phoneNumber, email, password, avatarUrl } = req.body;

    console.log('Datos de registro de admin recibidos:', {
        firstName,
        lastName,
        birthDate,
        phoneNumber,
        email,
        passwordLength: password ? password.length : 0,
        avatarUrl
    });

    // Validamos que todos los campos obligatorios estén presentes
    if (!firstName || !lastName || !email || !password || !birthDate || !phoneNumber) {
        return res.status(400).json({
            message: "Todos los campos son obligatorios excepto la foto de perfil",
            requiredFields: {
                firstName: !firstName ? "Nombre es requerido" : null,
                lastName: !lastName ? "Apellido es requerido" : null,
                email: !email ? "Email es requerido" : null,
                password: !password ? "Contraseña es requerida" : null,
                birthDate: !birthDate ? "Fecha de nacimiento es requerida" : null,
                phoneNumber: !phoneNumber ? "Número de teléfono es requerido" : null
            }
        });
    }
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const user = await User.create({
            firstName,
            lastName,
            birthDate,
            phoneNumber,
            email,
            password,
            avatarUrl,
            role: 'admin'
        });
        console.log('Enviando correo de bienvenida a administrador:', email);
        try {
            await sendAdminWelcomeEmail(email, `${firstName} ${lastName}`);
        } catch (emailError) {
            console.error('Error al enviar correo de bienvenida al administrador:', emailError);
            // Continuamos aunque falle el correo
        }

        res.status(201).json({
            message: 'Administrador registrado exitosamente',
        });

    } catch (error) {
        console.error('Error en registro de administrador:', error);
        res.status(500).json({ message: 'Error al registrar el administrador', error: error.message });
    }
})

router.post('/register', async (req, res) => {
    const { firstName, lastName, birthDate, phoneNumber, email, password, avatarUrl } = req.body;

    console.log('Datos de registro recibidos:', {
        firstName,
        lastName,
        birthDate,
        phoneNumber,
        email,
        passwordLength: password ? password.length : 0,
        avatarUrl
    });

    // Validamos que todos los campos obligatorios estén presentes
    if (!firstName || !lastName || !email || !password || !birthDate || !phoneNumber) {
        return res.status(400).json({
            message: "Todos los campos son obligatorios excepto la foto de perfil",
            requiredFields: {
                firstName: !firstName ? "Nombre es requerido" : null,
                lastName: !lastName ? "Apellido es requerido" : null,
                email: !email ? "Email es requerido" : null,
                password: !password ? "Contraseña es requerida" : null,
                birthDate: !birthDate ? "Fecha de nacimiento es requerida" : null,
                phoneNumber: !phoneNumber ? "Número de teléfono es requerido" : null
            }
        });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        console.log('Creando usuario con avatarUrl:', avatarUrl);

        // Creamos el usuario sin enviar correo primero
        let user;
        try {
            user = await User.create({
                firstName,
                lastName,
                birthDate,
                phoneNumber,
                email,
                password,
                avatarUrl
            });

            console.log('Usuario creado correctamente:', {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            });
        } catch (createError) {
            console.error('Error al crear usuario:', createError);
            return res.status(500).json({
                message: "Error al crear usuario en la base de datos",
                error: createError.message
            });
        }

        // Enviamos el correo de bienvenida
        try {
            console.log('Enviando correo de bienvenida a', email);
            await sendWelcomeEmail(email, `${firstName} ${lastName}`);
        } catch (emailError) {
            console.error('Error al enviar correo de bienvenida:', emailError);
            // Continuamos aunque falle el correo
        }

        // Generamos el token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl,
            message: 'Usuario registrado exitosamente'
        });
    } catch (error) {
        console.error('Error en registro de usuario:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post('/login', async (req, res) => {
    console.log("BODY RECIBIDO:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect data" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Incluir el rol y nombre/apellido en la respuesta
        res.json({
            token,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            message: "Login exitoso"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;