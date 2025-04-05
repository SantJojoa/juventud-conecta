const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { where } = require("sequelize");
const { isAdmin } = require("../middlewares/authMiddleware");
const { sendWelcomeEmail, sendAdminWelcomeEmail } = require("../services/sendEmail");

const router = express.Router();

router.post('/register-admin', isAdmin, async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' })
    }
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: 'admin'
        });
        console.log('Enviando correo de bienvenida a', email);
        await sendAdminWelcomeEmail(email, name)
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
})

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email | !password) {
        return res.status(400).json({ message: "Nombre, email y contraseña son requeridos" })
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password
        });
        console.log('Enviando correo de bienvenida a', email);
        await sendWelcomeEmail(email, name)
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            role: user.role,
            name: user.name,
            message: 'Usuario registrado exitosamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
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

        // Incluir el rol en la respuesta
        res.json({
            token,
            role: user.role,
            name: user.name,
            message: "Login exitoso"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;