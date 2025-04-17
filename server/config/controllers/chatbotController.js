const { Event } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

const getUpcomingEvents = async () => {
    const today = moment().startOf('day').toDate();
    return await Event.findAll({
        where: { date: { [Op.gte]: today } },
        order: [['date', 'ASC']]
    });
};

const getPastEvents = async () => {
    const today = moment().startOf('day').toDate();
    return await Event.findAll({
        where: { date: { [Op.lt]: today } },
        order: [['date', 'DESC']]
    });
};

const getTodayEvents = async () => {
    const start = moment().startOf('day').toDate();
    const end = moment().endOf('day').toDate();
    return await Event.findAll({
        where: {
            date: {
                [Op.gte]: start,
                [Op.lte]: end,
            }
        },
        order: [['date', 'ASC']]
    });
};

const getWeekendEvents = async () => {
    const start = moment().startOf('isoWeek').add(5, 'days').startOf('day').toDate();
    const end = moment().startOf('isoWeek').add(6, 'days').endOf('day').toDate();
    return await Event.findAll({
        where: {
            date: {
                [Op.gte]: start,
                [Op.lte]: end,
            }
        },
        order: [['date', 'ASC']]
    });
};

const getEventsByLocation = async (location) => {
    const today = moment().startOf('day').toDate();
    return await Event.findAll({
        where: {
            location: { [Op.iLike]: `%${location}%` },
            date: { [Op.gte]: today }
        },
        order: [['date', 'ASC']]
    });
};

exports.chatbot = async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ reply: 'Por favor, escribe una pregunta.' });
    }

    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('hola') || lowerMsg.includes('buenas') || lowerMsg.trim() === '') {
        return res.json({
            messages: [
                { sender: 'bot', text: '¡Hola! ¿En qué puedo ayudarte?' },
                {
                    sender: 'bot',
                    text: 'Elige una opción para comenzar',
                    quickReplies: [
                        { title: 'Próximos eventos', payload: 'proximos' },
                        { title: 'Eventos finalizados', payload: 'finalizados' },
                        { title: 'Eventos de hoy', payload: 'hoy' },
                        { title: 'Fin de semana', payload: 'fin-de-semana' },
                        { title: 'En una ubicación', payload: 'ubicacion' }
                    ]
                }
            ]
        });
    }

    if (lowerMsg.includes('próximos') || lowerMsg.includes('proximos') || lowerMsg.includes('futuro') || lowerMsg.includes('futuros')) {
        const events = await getUpcomingEvents();
        if (!events.length) return res.json({ reply: 'No hay eventos próximos.' });
        const reply = 'Eventos próximos:\n' + events.slice(0, 5).map(e => `- ${e.title} (${moment(e.date).format('DD/MM/YYYY')})`).join('\n');
        return res.json({ reply });
    }

    if (lowerMsg.includes('finalizados') || lowerMsg.includes('pasados') || lowerMsg.includes('anteriores') || lowerMsg.includes('terminaron')) {
        const events = await getPastEvents();
        if (!events.length) return res.json({ reply: 'No hay eventos finalizados.' });
        const reply = 'Eventos finalizados:\n' + events.slice(0, 5).map(e => `- ${e.title} (${moment(e.date).format('DD/MM/YYYY')})`).join('\n');
        return res.json({ reply });
    }

    if (lowerMsg.includes('hoy')) {
        const events = await getTodayEvents();
        if (!events.length) return res.json({ reply: 'No hay eventos para hoy.' });
        const reply = 'Eventos de hoy:\n' + events.map(e => `- ${e.title} (${moment(e.date).format('HH:mm')})`).join('\n');
        return res.json({ reply });
    }

    if (lowerMsg.includes('fin de semana') || lowerMsg.includes('sábado') || lowerMsg.includes('sabado') || lowerMsg.includes('domingo')) {
        const events = await getWeekendEvents();
        if (!events.length) return res.json({ reply: 'No hay eventos para este fin de semana.' });
        const reply = 'Eventos este fin de semana:\n' + events.map(e => `- ${e.title} (${moment(e.date).format('DD/MM/YYYY HH:mm')})`).join('\n');
        return res.json({ reply });
    }

    const matchLocation = lowerMsg.match(/en ([a-záéíóú\s]+)/i);
    if (matchLocation) {
        const location = matchLocation[1].trim();
        const events = await getEventsByLocation(location);
        if (!events.length) return res.json({ reply: `No hay eventos próximos en ${location}.` });
        const reply = `Eventos próximos en ${location}:\n` + events.map(e => `- ${e.title} (${moment(e.date).format('DD/MM/YYYY')})`).join('\n');
        return res.json({ reply });
    }

    if (lowerMsg.includes('hola')) {
        const reply = '¡Hola! ¿En qué puedo ayudarte?';
        return res.json({ reply });
    }

    return res.json({ reply: 'Lo siento, no entendí tu pregunta. Puedes preguntar por eventos próximos, finalizados, de hoy, este fin de semana, o en una ciudad.' });
};