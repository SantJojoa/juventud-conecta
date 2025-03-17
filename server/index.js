const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the server");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    await sequelize.sync({ alter: true });
});

const eventRoutes = require('./config/routes/eventRoutes');
app.use("/api/events", eventRoutes);