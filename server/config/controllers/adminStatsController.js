const { Sequelize, Op } = require('sequelize');
const { sequelize, User, Event } = require('../models');
const UserEventRating = require('../models/UserEventRating');

const getAdminStats = async (req, res) => {
    try {
        const todayStr = new Date().toISOString().slice(0, 10);

        const [totalUsers, totalAdmins, totalEvents, upcomingEvents, pastEvents] = await Promise.all([
            User.count(),
            User.count({ where: { role: 'admin' } }),
            Event.count(),
            Event.count({ where: { startDate: { [Op.gte]: todayStr } } }),
            Event.count({ where: { startDate: { [Op.lt]: todayStr } } }),
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

        // Totales de interacción
        const [totalFavoritesRow, totalCommentsRow, totalRatingsRow] = await Promise.all([
            sequelize.query('SELECT COUNT(*)::int AS cnt FROM "UserFavorites"', { type: Sequelize.QueryTypes.SELECT }),
            sequelize.query('SELECT COUNT(*)::int AS cnt FROM "Comments"', { type: Sequelize.QueryTypes.SELECT }),
            sequelize.query('SELECT COUNT(*)::int AS cnt FROM "UserEventRatings"', { type: Sequelize.QueryTypes.SELECT }),
        ]);

        const totalFavorites = totalFavoritesRow?.[0]?.cnt ?? 0;
        const totalComments = totalCommentsRow?.[0]?.cnt ?? 0;
        const totalRatings = totalRatingsRow?.[0]?.cnt ?? 0;

        const avgCommentsPerEvent = totalEvents ? Number((totalComments / totalEvents).toFixed(2)) : 0;
        const avgFavoritesPerEvent = totalEvents ? Number((totalFavorites / totalEvents).toFixed(2)) : 0;
        const avgRatingsPerEvent = totalEvents ? Number((totalRatings / totalEvents).toFixed(2)) : 0;

        // Tendencias por mes (últimos 6 meses)
        const usersByMonth = await sequelize.query(
            `SELECT to_char(date_trunc('month', "createdAt"), 'YYYY-MM') AS month, COUNT(*)::int AS count
             FROM "Users"
             GROUP BY 1
             ORDER BY 1 DESC
             LIMIT 6`,
            { type: Sequelize.QueryTypes.SELECT }
        );
        const eventsByMonth = await sequelize.query(
            `SELECT to_char(date_trunc('month', "createdAt"), 'YYYY-MM') AS month, COUNT(*)::int AS count
             FROM "Events"
             GROUP BY 1
             ORDER BY 1 DESC
             LIMIT 6`,
            { type: Sequelize.QueryTypes.SELECT }
        );

        res.json({
            totals: {
                totalUsers,
                totalEvents,
                globalAverageRating,
                totalAdmins,
                upcomingEvents,
                pastEvents,
                totalFavorites,
                totalComments,
                totalRatings,
                avgCommentsPerEvent,
                avgFavoritesPerEvent,
                avgRatingsPerEvent,
            },
            categories: categoriesAgg,
            topByViews,
            topByFavorites,
            topByRating,
            topByComments,
            trends: {
                usersByMonth: usersByMonth.reverse(),
                eventsByMonth: eventsByMonth.reverse(),
            },
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de admin:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};

module.exports = { getAdminStats };


