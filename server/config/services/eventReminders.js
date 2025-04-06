const schedule = require('node-schedule');
const { Op } = require('sequelize');
const Event = require('../models/Event');
const User = require('../models/User');
const { sendEventReminderEmail } = require('./sendEmail');

/**
 * Verifica si hay eventos próximos (dentro de las próximas 48 horas)
 * y envía correos de recordatorio a los usuarios que los tienen como favoritos
 */
const checkUpcomingEvents = async () => {
    try {
        console.log('Verificando eventos próximos para enviar recordatorios...');

        // Obtener fecha actual y fecha límite (48 horas después)
        const now = new Date();
        const reminderWindow = new Date(now);
        reminderWindow.setHours(now.getHours() + 48);

        // Formato de fechas para la consulta
        const todayFormatted = now.toISOString().split('T')[0];
        const limitFormatted = reminderWindow.toISOString().split('T')[0];

        console.log(`Buscando eventos entre ${todayFormatted} y ${limitFormatted}`);

        // Buscar eventos que ocurrirán en las próximas 48 horas
        const upcomingEvents = await Event.findAll({
            where: {
                date: {
                    [Op.between]: [todayFormatted, limitFormatted]
                }
            },
            include: [{
                model: User,
                as: 'favoritedBy',
                through: { attributes: [] }
            }]
        });

        console.log(`Se encontraron ${upcomingEvents.length} eventos próximos`);

        // Para cada evento, enviar correo a los usuarios que lo tienen como favorito
        let totalEmails = 0;

        for (const event of upcomingEvents) {
            const users = event.favoritedBy || [];
            console.log(`Evento "${event.title}" tiene ${users.length} usuarios que lo marcaron como favorito`);

            for (const user of users) {
                console.log(`Enviando recordatorio a ${user.email} sobre el evento "${event.title}"`);
                await sendEventReminderEmail(user.email, user.name, event);
                totalEmails++;
            }
        }

        console.log(`Se enviaron ${totalEmails} correos de recordatorio`);
    } catch (error) {
        console.error('Error al verificar eventos próximos:', error);
    }
};

/**
 * Inicializa el sistema de recordatorios para ejecutarse diariamente
 */
const initEventReminderSystem = () => {
    try {
        // Ejecutar una vez al iniciar el servidor
        checkUpcomingEvents();

        // Programar para que se ejecute todos los días a las 9:00 AM
        const dailyJob = schedule.scheduleJob('0 9 * * *', () => {
            console.log('Ejecutando verificación programada de eventos próximos...');
            checkUpcomingEvents();
        });

        console.log('Sistema de recordatorios de eventos inicializado correctamente');
        return dailyJob;
    } catch (error) {
        console.error('Error al inicializar el sistema de recordatorios:', error);
        return null;
    }
};

module.exports = {
    initEventReminderSystem,
    checkUpcomingEvents
};