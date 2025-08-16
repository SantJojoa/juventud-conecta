import TelegramBot from 'node-telegram-bot-api';
import { User } from '../models/index.js';

const token = process.env.TELEGRAM_BOT_TOKEN;
export const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = match[1]; // puede venir undefined si no mandan parámetro

    if (!userId) {
        bot.sendMessage(chatId, "¡Hola! Para vincular tu cuenta, primero regístrate en la plataforma y vuelve a entrar con el enlace de invitación.");
        return;
    }

    try {
        const [rowsUpdated] = await User.update(
            { telegramChatId: chatId },
            { where: { id: userId } }
        );

        if (rowsUpdated > 0) {
            const user = await User.findByPk(userId);
            bot.sendMessage(chatId, `
                🎉 *¡Bienvenido a Juventud Conecta!* 🎉  

Esta es una plataforma pensada *por y para la juventud de Pasto*.  
Ahora que vinculaste tu cuenta con Telegram vas a poder:  

✅ Recibir notificaciones de los eventos que marcaste como favoritos.  
✅ Enterarte con anticipación de actividades culturales, académicas y sociales.  
✅ Recordatorios automáticos cuando un evento esté a punto de comenzar.  
✅ Acceso rápido a las novedades sin necesidad de entrar siempre a la web.  
✅ Oportunidad de participar en encuestas y dinámicas especiales para jóvenes.  

🚀 *Tu participación hace la diferencia*.  
Explora los eventos, márcalos como favoritos y activa tus recordatorios para no perderte nada.  

📲 Si quieres volver a ver tus eventos favoritos, solo entra a la plataforma y los encontrarás organizados para ti.  

Gracias por ser parte de esta iniciativa 💙✨  
— *Plataforma Juventud Conecta*`,
                { parse_mode: 'Markdown' });
        } else {
            bot.sendMessage(chatId, "⚠️ No encontramos tu usuario en la plataforma. Verifica que te registraste correctamente.");
        }
    } catch (error) {
        console.error("Error actualizando chatId:", error);
        bot.sendMessage(chatId, "❌ Hubo un problema vinculando tu cuenta. Intenta más tarde.");
    }
});

export async function sendTelegramMessage(userId, message) {
    const user = await User.findByPk(userId);
    if (user?.telegramChatId) {
        bot.sendMessage(user.telegramChatId, message);
    }
}
