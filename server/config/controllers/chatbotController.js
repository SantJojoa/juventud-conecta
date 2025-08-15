const { Event } = require('../models');
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
    const today = moment().startOf('day').toDate();
    return await Event.findAll({
        where: { date: { [Op.gte]: today } },
        order: [['date', 'ASC']]
    });
};

const getTomorrowEvents = async () => {
    const start = moment().add(1, 'days').startOf('day').toDate();
    const end = moment().add(1, 'days').endOf('day').toDate();
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
    const today = moment().startOf('day').toDate();
    const saturday = moment().isoWeekday(6).startOf('day').toDate();
    const sunday = moment().isoWeekday(7).endOf('day').toDate();
    return await Event.findAll({
        where: {
            date: {
                [Op.gte]: saturday,
                [Op.lte]: sunday,
            }
        },
        order: [['date', 'ASC']]
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

const getPastEvents = async () => {
    const today = moment().startOf('day').toDate();
    return await Event.findAll({
        where: { date: { [Op.lt]: today } },
        order: [['date', 'DESC']]
    });
};

// Controlador principal del chatbot
exports.chatbot = async (req, res) => {
    const { message } = req.body;
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
                        { title: 'Ir a Alcaldía de Pasto', payload: 'alcaldia' },
                        { title: 'Ir a Observatorio de Juventud', payload: 'observatorio' }
                    ]
                }
            ]
        });
    }

    // Corrección ortográfica y procesamiento NLP
    const correctedMsg = correctMessage(message);
    const doc = nlp(correctedMsg);
    const lowerMsg = correctedMsg.toLowerCase();
    const originalLowerMsg = message.toLowerCase();

    // Detectar palabras claves para fechas (ORDEN ESPECÍFICO A GENERAL)
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
                        { title: 'Ir a Alcaldía de Pasto', payload: 'alcaldia' },
                        { title: 'Ir a Observatorio de Juventud', payload: 'observatorio' }
                    ]
                }
            ]
        });
    }

    // Eventos para mañana (PRIMERO - más específico)
    if (hasTomorrow) {
        const events = await getTomorrowEvents();
        if (!events.length) return res.json({ reply: 'Para mañana no hay eventos.' });
        const reply = 'Eventos para mañana:\n' + events.map(e =>
            `- ${e.title} (${moment(e.date).format('HH:mm')})`
        ).join('\n');
        return res.json({ reply });
    }

    // Eventos de hoy
    if (hasToday) {
        const events = await getTodayEvents();
        if (!events.length) return res.json({ reply: 'No hay eventos para hoy.' });
        const reply = 'Eventos de hoy:\n' + events.map(e =>
            `- ${e.title} (${moment(e.date).format('HH:mm')})`
        ).join('\n');
        return res.json({ reply });
    }

    // Eventos fin de semana
    if (hasWeekend) {
        const events = await getWeekendEvents();
        if (!events.length) return res.json({ reply: 'No hay eventos para este fin de semana.' });
        const reply = 'Eventos este fin de semana:\n' + events.map(e =>
            `- ${e.title} (${moment(e.date).format('DD/MM/YYYY HH:mm')})`
        ).join('\n');
        return res.json({ reply });
    }

    // Eventos pasados
    if (hasPast) {
        const events = await getPastEvents();
        if (!events.length) return res.json({ reply: 'No hay eventos finalizados.' });
        const reply = 'Eventos finalizados:\n' + events.slice(0, 5).map(e =>
            `- ${e.title} (${moment(e.date).format('DD/MM/YYYY')})`
        ).join('\n');
        return res.json({ reply });
    }

    // Eventos próximos/futuros (ÚLTIMO - más general)
    if (hasUpcoming) {
        const events = await getUpcomingEvents();
        if (!events.length) return res.json({ reply: 'No hay eventos próximos.' });
        const reply = 'Eventos próximos:\n' + events.slice(0, 5).map(e =>
            `- ${e.title} (${moment(e.date).format('DD/MM/YYYY')})`
        ).join('\n');
        return res.json({ reply });
    }

    // Redirección a la Alcaldía (acepta con y sin tilde)
    if (lowerMsg.includes('alcaldia') || lowerMsg.includes('alcaldía')) {
        return res.json({
            redirect: 'https://www.pasto.gov.co/'
        });
    }

    // Redirección al Observatorio de Juventud
    if (lowerMsg.includes('observatorio')) {
        return res.json({
            redirect: 'https://observatoriojuventud.pasto.gov.co/inicio'
        });
    }

    // Respuesta por defecto mejorada
    return res.json({
        reply: `Lo siento, no entendí tu pregunta.\n\nPuedes visitar nuestro Instagram oficial: https://www.instagram.com/juventudpasto/ o escribirnos a juventud@pasto.gov.co para más información.`
    });
};