// controllers/chatbotController.js
const { Event, User } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');
const natural = require('natural');
const nlp = require('compromise');

// Diccionario de palabras clave para corrección ortográfica
const dictionary = [
    'hola', 'eventos', 'próximos', 'finalizados', 'hoy', 'pasados', 'anteriores',
    'fin', 'semana', 'sábado', 'sabado', 'domingo', 'futuros', 'buscar', 'ciudad',
    'mañana'
];

// Inicializamos el corrector ortográfico
const spellcheck = new natural.Spellcheck(dictionary);

// Función para corregir ortografía
const correctMessage = (msg) => {
    const tokenizer = new natural.WordTokenizer();
    const words = tokenizer.tokenize(msg.toLowerCase());
    const corrected = words.map(word => {
        if (dictionary.includes(word)) return word; // No corregir si está en diccionario
        return spellcheck.getCorrections(word, 1)[0] || word;
    });
    return corrected.join(' ');
};

// Funciones auxiliares para obtener eventos
const getUpcomingEvents = async () => {
    const todayStr = moment().format('YYYY-MM-DD');
    return await Event.findAll({
        where: { startDate: { [Op.gte]: todayStr } },
        order: [['startDate', 'ASC'], ['startTime', 'ASC']]
    });
};

const getTomorrowEvents = async () => {
    const tomorrowStr = moment().add(1, 'days').format('YYYY-MM-DD');
    return await Event.findAll({
        where: { startDate: tomorrowStr },
        order: [['startDate', 'ASC'], ['startTime', 'ASC']]
    });
};

const getWeekendEvents = async () => {
    const saturdayStr = moment().isoWeekday(6).format('YYYY-MM-DD');
    const sundayStr = moment().isoWeekday(7).format('YYYY-MM-DD');
    return await Event.findAll({
        where: { startDate: { [Op.gte]: saturdayStr, [Op.lte]: sundayStr } },
        order: [['startDate', 'ASC'], ['startTime', 'ASC']]
    });
};

const getTodayEvents = async () => {
    const todayStr = moment().format('YYYY-MM-DD');
    return await Event.findAll({
        where: { startDate: todayStr },
        order: [['startDate', 'ASC'], ['startTime', 'ASC']]
    });
};

const getPastEvents = async () => {
    const todayStr = moment().format('YYYY-MM-DD');
    return await Event.findAll({
        where: { startDate: { [Op.lt]: todayStr } },
        order: [['startDate', 'DESC'], ['startTime', 'DESC']]
    });
};

// Controlador principal del chatbot
exports.chatbot = async (req, res) => {
    const { message, userId } = req.body;
    if (!message) {
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
                        { title: 'Eventos de mañana', payload: 'mañana' },
                        { title: 'Fin de semana', payload: 'fin de semana' },
                        { title: 'Recomendados', payload: 'recomendados' },
                        { title: 'Mis favoritos', payload: 'favoritos' },
                        { title: 'Ir a Alcaldía de Pasto', payload: 'alcaldia' },
                        { title: 'Ir a Observatorio de Juventud', payload: 'observatorio' }
                    ]
                }
            ]
        });
    }

    // Corrección ortográfica y NLP
    const correctedMsg = correctMessage(message);
    const doc = nlp(correctedMsg);
    const lowerMsg = correctedMsg.toLowerCase();
    const originalLowerMsg = message.toLowerCase();

    // Detectar palabras clave de fechas
    const hasTomorrow = lowerMsg.includes('mañana') || originalLowerMsg.includes('mañana') || lowerMsg === 'mañana';
    const hasToday = doc.has('hoy') || lowerMsg.includes('hoy') || originalLowerMsg.includes('hoy') || lowerMsg === 'hoy';
    const hasWeekend = lowerMsg.includes('fin de semana') || lowerMsg.includes('sábado') || lowerMsg.includes('sabado') || lowerMsg.includes('domingo') || lowerMsg === 'fin de semana';
    const hasPast = lowerMsg.includes('pasados') || lowerMsg.includes('anteriores') || lowerMsg.includes('finalizados') || lowerMsg.includes('terminaron') || lowerMsg === 'finalizados';
    const hasUpcoming = (lowerMsg.includes('próximos') || lowerMsg.includes('futuros') || lowerMsg.includes('proximos') || lowerMsg === 'proximos') && !hasTomorrow;

    // Saludo y menú principal
    if (doc.has('hola') || doc.has('buenas') || lowerMsg.trim() === '') {
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
                        { title: 'Eventos de mañana', payload: 'mañana' },
                        { title: 'Fin de semana', payload: 'fin de semana' },
                        { title: 'Recomendados', payload: 'recomendados' },
                        { title: 'Mis favoritos', payload: 'favoritos' },
                        { title: 'Ir a Alcaldía de Pasto', payload: 'alcaldia' },
                        { title: 'Ir a Observatorio de Juventud', payload: 'observatorio' }
                    ]
                }
            ]
        });
    }

    // Eventos para mañana
    if (hasTomorrow) {
        const events = await getTomorrowEvents();
        if (!events.length) return res.json({ reply: 'Para mañana no hay eventos.' });
        const reply = 'Eventos para mañana:\n' + events.map(e => `- ${e.title} (${(e.startTime || '').toString().slice(0, 5)})`).join('\n');
        return res.json({ reply });
    }

    // Eventos de hoy
    if (hasToday) {
        const events = await getTodayEvents();
        if (!events.length) return res.json({ reply: 'No hay eventos para hoy.' });
        const reply = 'Eventos de hoy:\n' + events.map(e => `- ${e.title} (${(e.startTime || '').toString().slice(0, 5)})`).join('\n');
        return res.json({ reply });
    }

    // Eventos fin de semana
    if (hasWeekend) {
        const events = await getWeekendEvents();
        if (!events.length) return res.json({ reply: 'No hay eventos para este fin de semana.' });
        const reply = 'Eventos este fin de semana:\n' + events.map(e => {
            const dateStr = moment(e.startDate).format('DD/MM/YYYY');
            const time = (e.startTime || '').toString().slice(0, 5);
            return `- ${e.title} (${dateStr} ${time})`;
        }).join('\n');
        return res.json({ reply });
    }

    // Eventos pasados
    if (hasPast) {
        const events = await getPastEvents();
        if (!events.length) return res.json({ reply: 'No hay eventos finalizados.' });
        const reply = 'Eventos finalizados:\n' + events.slice(0, 5).map(e => `- ${e.title} (${moment(e.startDate).format('DD/MM/YYYY')})`).join('\n');
        return res.json({ reply });
    }

    // Recomendados
    if (lowerMsg.includes('recomendados')) {
        try {
            const todayStr = moment().format('YYYY-MM-DD');
            // Si no hay userId, devolver eventos populares
            if (!userId) {
                const popular = await Event.findAll({
                    where: { startDate: { [Op.gte]: todayStr } },
                    limit: 5,
                    order: [['viewsCount', 'DESC'], ['startDate', 'ASC'], ['startTime', 'ASC']]
                });
                if (!popular.length) return res.json({ reply: 'No hay recomendaciones en este momento.' });
                const reply = 'Eventos recomendados:\n' + popular.map(e => `- ${e.title} (${moment(e.startDate).format('DD/MM/YYYY')})`).join('\n');
                return res.json({ reply });
            }
            // Obtener favoritos del usuario
            const user = await User.findByPk(userId, {
                include: [{ model: Event, as: 'favoriteEvents', attributes: ['id', 'category'], through: { attributes: [] } }]
            });
            const favorites = user?.favoriteEvents || [];
            let responseEvents = [];
            if (favorites.length === 0) {
                responseEvents = await Event.findAll({
                    where: { startDate: { [Op.gte]: todayStr } },
                    limit: 5,
                    order: [['viewsCount', 'DESC'], ['startDate', 'ASC'], ['startTime', 'ASC']]
                });
            } else {
                const counts = favorites.reduce((acc, ev) => (acc[ev.category] = (acc[ev.category] || 0) + 1, acc), {});
                const topCat = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
                responseEvents = await Event.findAll({
                    where: { category: topCat, startDate: { [Op.gte]: todayStr } },
                    limit: 5,
                    order: [['startDate', 'ASC'], ['startTime', 'ASC']]
                });
            }
            if (!responseEvents.length) return res.json({ reply: 'No hay recomendaciones en este momento.' });
            const reply = 'Eventos recomendados:\n' + responseEvents.map(e => `- ${e.title} (${moment(e.startDate).format('DD/MM/YYYY')})`).join('\n');
            return res.json({ reply });
        } catch (e) {
            console.error('Error en recomendados:', e);
            return res.json({ reply: 'Hubo un error al obtener recomendaciones.' });
        }
    }

    // Favoritos (placeholder)
    if (lowerMsg.includes('favoritos')) {
        return res.json({ reply: 'Puedes ver y gestionar tus favoritos en tu perfil.' });
    }

    // Eventos próximos (general)
    if (hasUpcoming) {
        const events = await getUpcomingEvents();
        if (!events.length) return res.json({ reply: 'No hay eventos próximos.' });
        const reply = 'Eventos próximos:\n' + events.slice(0, 5).map(e => `- ${e.title} (${moment(e.startDate).format('DD/MM/YYYY')})`).join('\n');
        return res.json({ reply });
    }

    // Redirección a la Alcaldía
    if (lowerMsg.includes('alcaldia') || lowerMsg.includes('alcaldía')) {
        return res.json({ redirect: 'https://www.pasto.gov.co/' });
    }

    // Redirección al Observatorio
    if (lowerMsg.includes('observatorio')) {
        return res.json({ redirect: 'https://observatoriojuventud.pasto.gov.co/inicio' });
    }

    // Respuesta por defecto
    return res.json({
        reply: `Lo siento, no entendí tu pregunta.\n\nPuedes visitar nuestro Instagram oficial: https://www.instagram.com/juventudpasto/ o escribirnos a juventud@pasto.gov.co para más información.`
    });
};