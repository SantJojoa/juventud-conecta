require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, initModels } = require('./config/models'); // Centraliza modelos
const { initEventReminderSystem } = require('./config/services/eventReminders');

const app = express();

const chatbotRoutes = require('./config/routes/chatbotRoutes');

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the server");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    await initModels(); // Asegura que todos los modelos están listos

    // Inicializar el sistema de recordatorios de eventos
    initEventReminderSystem();
});

app.use("/api/chatbot", chatbotRoutes);

const eventRoutes = require('./config/routes/eventRoutes');
app.use("/api/events", eventRoutes);

const authRoutes = require('./config/routes/authRoutes');
app.use('/api/auth', authRoutes);

const userRoutes = require('./config/routes/userRoutes');
app.use('/api/users', userRoutes);

const commentRoutes = require('./config/routes/commentRoutes');
app.use('/api/comments', commentRoutes);

const ratingRoutes = require("./config/routes/ratingRoutes");
app.use("/api/rating", ratingRoutes);