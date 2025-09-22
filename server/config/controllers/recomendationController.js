// controllers/recommendationController.js
const { User, Event } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

async function getRecommendations(req, res) {
    try {
        const { userId } = req.params;
        const todayStr = moment().format("YYYY-MM-DD");

        // 1) Obtener favoritos del usuario mediante la asociación
        const user = await User.findByPk(userId, {
            include: [{ model: Event, as: "favoriteEvents", attributes: ["id", "category"], through: { attributes: [] } }]
        });
        const favorites = user?.favoriteEvents || [];
        const favoriteIds = favorites.map(e => e.id);

        // 2) Si no tiene favoritos, recomendar próximos eventos populares por vistas
        if (favorites.length === 0) {
            const popular = await Event.findAll({
                where: { startDate: { [Op.gte]: todayStr } },
                limit: 5,
                order: [["viewsCount", "DESC"], ["startDate", "ASC"], ["startTime", "ASC"]],
            });
            return res.json(popular);
        }

        // 3) Contar categorías favoritas
        const categoryCount = {};
        favorites.forEach(ev => {
            const cat = ev.category;
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });
        const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0][0];

        // 4) Buscar próximos eventos en la categoría top que no estén en favoritos
        const recommended = await Event.findAll({
            where: {
                category: topCategory,
                startDate: { [Op.gte]: todayStr },
                id: { [Op.notIn]: favoriteIds },
            },
            limit: 5,
            order: [["startDate", "ASC"], ["startTime", "ASC"]],
        });

        // 5) Si faltan, rellenar con próximos populares
        if (recommended.length < 5) {
            const more = await Event.findAll({
                where: {
                    startDate: { [Op.gte]: todayStr },
                    id: { [Op.notIn]: [...favoriteIds, ...recommended.map(e => e.id)] },
                },
                limit: 5 - recommended.length,
                order: [["viewsCount", "DESC"], ["startDate", "ASC"], ["startTime", "ASC"]],
            });
            return res.json([...recommended, ...more]);
        }

        res.json(recommended);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error obteniendo recomendaciones" });
    }
}

module.exports = { getRecommendations };