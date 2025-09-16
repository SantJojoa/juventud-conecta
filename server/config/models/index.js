const sequelize = require('../db');
const User = require('./User');
const Event = require('./Event');
const Comment = require('./Coment');
const EventForm = require('./EventForm');
const EventFormQuestion = require('./EventFormQuestion');
const EventFormSubmission = require('./EventFormSubmission');
const EventFormAnswer = require('./EventFormAnswer');


User.belongsToMany(Event, { through: 'UserFavorites', as: 'favoriteEvents' });
Event.belongsToMany(User, { through: 'UserFavorites', as: 'favoritedBy' });

const initModels = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("✅ Modelos sincronizados con la base de datos");
    } catch (error) {
        console.error("🚨 Error al sincronizar modelos:", error);
    }
};

module.exports = {
    sequelize,
    User,
    Event,
    Comment,
    EventForm,
    EventFormQuestion,
    EventFormSubmission,
    EventFormAnswer,
    initModels
};
