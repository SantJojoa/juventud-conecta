const { Sequelize } = require('sequelize');
const { sequelize, User, Event } = require('../models');
const UserEventRating = require('../models/UserEventRating');

const getAdminStats = async (req, res) => {
    try {
        const [totalUsers, totalEvents] = await Promise.all([
            User.count(),
            Event.count(),
        ]);

        const ratingAgg = await UserEventRating.findAll({
            attributes: [[Sequelize.fn('AVG', Sequelize.col('rating')), 'avg']],
            raw: true,
        });
        const globalAverageRating = Number(ratingAgg?.[0]?.avg ?? 0);

        const categoriesAgg = await Event.findAll({
            attributes: ['category', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
            group: ['category'],
            order: [[Sequelize.literal('count'), 'DESC']],
            raw: true,
        });

        const topByViews = await Event.findAll({
            attributes: ['id', 'title', 'imageSrc', 'viewsCount'],
            order: [['viewsCount', 'DESC']],
            limit: 10,
            raw: true,
        });

        const topByFavorites = await sequelize.query(
            `SELECT e.id, e.title, e."imageSrc", COUNT(uf."EventId") AS "favoritesCount"
             FROM "UserFavorites" uf
             JOIN "Events" e ON e.id = uf."EventId"
             GROUP BY e.id, e.title, e."imageSrc"
             ORDER BY "favoritesCount" DESC
             LIMIT 10`,
            { type: Sequelize.QueryTypes.SELECT }
        );

        const topByRating = await sequelize.query(
            `SELECT e.id, e.title, e."imageSrc",
                    AVG(uer.rating) AS "avgRating",
                    COUNT(*) AS "ratingsCount"
             FROM "Events" e
             JOIN "UserEventRatings" uer ON uer."eventId" = e.id
             GROUP BY e.id, e.title, e."imageSrc"
             HAVING COUNT(*) >= 1
             ORDER BY "avgRating" DESC, "ratingsCount" DESC
             LIMIT 10`,
            { type: Sequelize.QueryTypes.SELECT }
        );

        const topByComments = await sequelize.query(
            `SELECT e.id, e.title, e."imageSrc",
                    COUNT(c.id) AS "commentsCount"
             FROM "Events" e
             JOIN "Comments" c ON c."eventId" = e.id
             GROUP BY e.id, e.title, e."imageSrc"
             ORDER BY "commentsCount" DESC
             LIMIT 10`,
            { type: Sequelize.QueryTypes.SELECT }
        );

        res.json({
            totals: {
                totalUsers,
                totalEvents,
                globalAverageRating,
            },
            categories: categoriesAgg,
            topByViews,
            topByFavorites,
            topByRating,
            topByComments,
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de admin:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};

module.exports = { getAdminStats };


