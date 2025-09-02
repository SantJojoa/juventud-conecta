// controllers/recommendationController.js
const { User, Event, UserFavorites } = require("../models");
const { Op } = require("sequelize");

async function getRecommendations(req, res) {
    try {
        const { userId } = req.params;

        // 1. Obtener favoritos del usuario
        const favorites = await UserFavorites.findAll({
            where: { UserId: userId },
            include: [{ model: Event, attributes: ["id", "category"] }],
        });

        // Si no tiene favoritos, recomendar eventos populares
        if (favorites.length === 0) {
            const popular = await Event.findAll({
                limit: 5,
                order: [["likesCount", "DESC"]],
            });
            return res.json(popular);
        }

        // 2. Contar las categorías favoritas
        const categoryCount = {};
        favorites.forEach((fav) => {
            const cat = fav.Event.category;
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });

        // 3. Escoger la categoría top
        const topCategory = Object.entries(categoryCount).sort(
            (a, b) => b[1] - a[1]
        )[0][0];

        // 4. Buscar eventos en esa categoría que no estén en favoritos
        const recommended = await Event.findAll({
            where: {
                category: topCategory,
                id: { [Op.notIn]: favorites.map((f) => f.Event.id) },
            },
            limit: 5,
            order: [["date", "ASC"]],
        });

        // Si no hay suficientes, mezclar con populares
        if (recommended.length < 5) {
            const filler = await Event.findAll({
                where: {
                    id: { [Op.notIn]: favorites.map((f) => f.Event.id) },
                },
                limit: 5 - recommended.length,
                order: [["likesCount", "DESC"]],
            });
            return res.json([...recommended, ...filler]);
        }

        res.json(recommended);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error obteniendo recomendaciones" });
    }
}

module.exports = { getRecommendations };
