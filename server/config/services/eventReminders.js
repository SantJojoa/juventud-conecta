const schedule = require('node-schedule');
const { Op } = require('sequelize');
const Event = require('../models/Event');
const User = require('../models/User');
const { sendEventReminderEmail } = require('./sendEmail');

const checkUpcomingEvents = async () => {
    try {
        console.log('Verificando eventos próximos para enviar recordatorios...');

        const now = new Date();
        const reminderWindow = new Date(now);
        reminderWindow.setHours(now.getHours() + 48);

        const todayFormatted = now.toISOString().split('T')[0];
        const limitFormatted = reminderWindow.toISOString().split('T')[0];

        console.log(`Buscando eventos entre ${todayFormatted} y ${limitFormatted}`);

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

        let totalEmails = 0;

        for (const event of upcomingEvents) {
            const users = event.favoritedBy || [];
            console.log(`Evento "${event.title}" tiene ${users.length} usuarios que lo marcaron como favorito`);

            for (const user of users) {
                console.log(`Enviando recordatorio a ${user.email} sobre el evento "${event.title}"`);
                await sendEventReminderEmail(user.email, { firstName: user.firstName, lastName: user.lastName }, event);
                totalEmails++;
            }
        }

        console.log(`Se enviaron ${totalEmails} correos de recordatorio`);
    } catch (error) {
        console.error('Error al verificar eventos próximos:', error);
    }
};

const initEventReminderSystem = () => {
    try {
        checkUpcomingEvents();
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