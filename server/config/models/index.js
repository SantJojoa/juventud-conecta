const sequelize = require('../db');
const User = require('./User');
const Event = require('./Event');
const Comment = require('./Coment');

User.belongsToMany(Event, { through: 'UserFavorites', as: 'favoriteEvents' });
Event.belongsToMany(User, { through: 'UserFavorites', as: 'favoritedBy' });

const initModels = async () => {
    try {
        // First sync with nullable fields to create missing columns
        await sequelize.sync({ alter: true });
        
        // Update existing events with current date if date is null
        const eventsWithNullDate = await Event.findAll({
            where: {
                date: null
            }
        });
        
        if (eventsWithNullDate.length > 0) {
            console.log(`Updating ${eventsWithNullDate.length} events with missing dates...`);
            const updatePromises = eventsWithNullDate.map(event => {
                // For existing records, use startDate if available, otherwise today's date
                const defaultDate = event.startDate || new Date();
                return event.update({ date: defaultDate });
            });
            
            await Promise.all(updatePromises);
            console.log("✅ Updated events with default dates");
        }

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
    initModels
};
