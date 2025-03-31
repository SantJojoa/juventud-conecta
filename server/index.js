const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize, initModels } = require('./config/models'); // Centraliza modelos

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the server");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    await initModels(); // Asegura que todos los modelos están listos
});

const eventRoutes = require('./config/routes/eventRoutes');
app.use("/api/events", eventRoutes);

const authRoutes = require('./config/routes/authRoutes');
app.use('/api/auth', authRoutes);

const userRoutes = require('./config/routes/userRoutes');
app.use('/api/users', userRoutes);