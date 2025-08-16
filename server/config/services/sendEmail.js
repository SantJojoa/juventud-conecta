const { sendTelegramMessage } = require('./telegramService');


const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const sendWelcomeEmail = async (email, { firstName, lastName }) => {
    console.log('Preparando mensaje para:', email, `${firstName} ${lastName}`);
    const msg = {
        to: email,
        from: 'no.reply.juventudconecta@gmail.com',
        subject: '¡Bienvenido a Juventud Conecta!',
        text: `Hola ${firstName} ${lastName}, !Bienvenido a la plataforma para la juventud, creada por la juventud.`,
        html: `
<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
<h2 style="color: #6C63FF; text-align: center;">¡Bienvenido a Juventud Conecta!</h2>
    <p style="font-size: 16px; color: #333;">
        Hola <strong>${firstName} ${lastName}</strong>,<br><br>
        Gracias por registrarte en nuestra plataforma. Ahora formas parte de una comunidad que impulsa la participación juvenil en eventos de alto impacto en Pasto. 💜
    </p>
    <p style="font-size: 16px; color: #333;">
        Pronto tendrás acceso a oportunidades, eventos, y muchas herramientas para conectarte con otras juventudes como tú.
    </p>
    <div style="text-align: center; margin-top: 30px;">
        <a href="https://tu-plataforma.com" style="background-color: #6C63FF; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 5px; display: inline-block;">Visita nuestra plataforma</a>
    </div>
    <p style="font-size: 12px; color: #999; margin-top: 40px; text-align: center;">
        Este correo fue enviado automáticamente. Por favor, no respondas a este mensaje.
    </p>
    <div style="text-align: center; margin-top: 30px;">
            <img src="https://i.postimg.cc/qRVXM3hB/logo-final.png" alt="Logo Juventud Conecta" style="max-width: 100px; opacity: 0.7;" /> 
    </div >
    </div>
</div>
`
    }

    try {
        const result = await sgMail.send(msg);
        console.log('Correo enviado con éxito', result);

        const telegramMsg = `🔔 Hola ${firstName}, bienvenido a Juventud Conecta! 🚀`;
        await sendTelegramMessage(id, telegramMsg);

        console.log(`Correo enviado a ${email}`);
    } catch (error) {
        console.error('Error al enviar el correo', error.response?.body || error);
    }
}

const sendAdminWelcomeEmail = async (email, { firstName, lastName }) => {
    console.log('Preparando email para dar la bienvenida al administrador', email, `${firstName} ${lastName}`);

    const msg = {
        to: email,
        from: 'no.reply.juventudconecta@gmail.com',
        subject: '¡Bienvenido a Juventud Conecta!',
        text: `Hola ${firstName} ${lastName}, Eres un administrador de la plataforma Juventud Conecta.`,
        html: `
<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
<h2 style="color: #6C63FF; text-align: center;">¡Bienvenido a Juventud Conecta!</h2>
    <p style="font-size: 16px; color: #333;">
        Hola <strong>${firstName} ${lastName}</strong>,<br><br>
        Eres un administrador de la plataforma Juventud Conecta. Podrás gestionar eventos, usuarios y configuraciones.
    </p>
    <p style="font-size: 16px; color: #333;">
        Tu ahora eres parte de la comunidad de administradores de Juventud Conecta. ¡Bienvenido!
    </p>
    <div style="text-align: center; margin-top: 30px;">
        <a href="https://tu-plataforma.com" style="background-color: #6C63FF; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 5px; display: inline-block;">Visita nuestra plataforma</a>
    </div>
    <p style="font-size: 12px; color: #999; margin-top: 40px; text-align: center;">
        Este correo fue enviado automáticamente. Por favor, no respondas a este mensaje.
    </p>
    <div style="text-align: center; margin-top: 30px;">
            <img src="https://i.postimg.cc/qRVXM3hB/logo-final.png" alt="Logo Juventud Conecta" style="max-width: 100px; opacity: 0.7;" /> 
    </div >
    </div>
</div>
`
    }

    try {
        const result = await sgMail.send(msg);
        console.log('Correo enviado con éxito', result);
        console.log(`Correo enviado a ${email}`);
    } catch (error) {
        console.error('Error al enviar el correo', error.response?.body || error);
    }


}

const sendEventReminderEmail = async (email, { id, firstName, lastName }, event) => {
    console.log('Preparando recordatorio de evento para', email, `${firstName} ${lastName}`, event.title);

    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const msg = {
        to: email,
        from: 'no.reply.juventudconecta@gmail.com',
        subject: `🔔 Recordatorio: ${event.title} - Próximamente`,
        text: `Hola ${firstName} ${lastName}, te recordamos que el evento "${event.title}" que marcaste como favorito se realizará pronto.`,
        html: `
<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #6C63FF; text-align: center;">¡Recordatorio de Evento!</h2>
        <p style="font-size: 16px; color: #333;">
            Hola <strong>${firstName} ${lastName}</strong>,<br><br>
            Te recordamos que el evento que marcaste como favorito se realizará pronto:
        </p>
        <div style="background-color: #f9f9f9; border-left: 4px solid #6C63FF; padding: 15px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">${event.title}</h3>
            <p style="margin: 5px 0;"><strong>Fecha:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0;"><strong>Horario:</strong> ${Array.isArray(event.schedule) ? event.schedule.join(', ') : event.schedule}</p>
            <p style="margin: 5px 0;"><strong>Ubicación:</strong> ${event.location}</p>
        </div>
        <p style="font-size: 16px; color: #333;">
            ¡No te lo pierdas! Marca esta fecha en tu calendario.
        </p>
        <div style="text-align: center; margin-top: 30px;">
            <a href="https://juventudconecta.com/eventos/${event.id}" style="background-color: #6C63FF; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 5px; display: inline-block;">Ver detalles del evento</a>
        </div>
        <p style="font-size: 12px; color: #999; margin-top: 40px; text-align: center;">
            Este correo fue enviado automáticamente. Por favor, no respondas a este mensaje.
        </p>
        <div style="text-align: center; margin-top: 30px;">
            <img src="https://i.postimg.cc/qRVXM3hB/logo-final.png" alt="Logo Juventud Conecta" style="max-width: 100px; opacity: 0.7;" /> 
        </div>
    </div>
</div>
`

    };
    try {
        const result = await sgMail.send(msg);
        console.log('Correo de recordatorio enviado con éxito', result);

        const telegramMsg = `🔔 Hola ${firstName}, recuerda que tu evento favorito "${event.title}" será el ${formattedDate} en ${event.location}.`;
        await sendTelegramMessage(id, telegramMsg);

        console.log(`Recordatorio de evento enviado a ${email}`);
        return true;
    } catch (error) {
        console.error('Error al enviar el correo de recordatorio', error.response?.body || error);
        return false;
    }

};

module.exports = { sendWelcomeEmail, sendAdminWelcomeEmail, sendEventReminderEmail }