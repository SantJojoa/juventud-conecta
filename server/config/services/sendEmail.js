const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const sendWelcomeEmail = async (email, name) => {
    console.log('Preparando mensaje para:', email, name);
    const msg = {
        to: email,
        from: 'no.reply.juventudconecta@gmail.com',
        subject: '¡Bienvenido a Juventud Conecta!',
        text: `Hola ${name}, !Bienvenido a la plataforma para la juventud, creada por la juventud.`,
        html: `
<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
<h2 style="color: #6C63FF; text-align: center;">¡Bienvenido a Juventud Conecta!</h2>
    <p style="font-size: 16px; color: #333;">
        Hola <strong>${name}</strong>,<br><br>
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
            <img src="https://i.postimg.cc/Pq0YBhJC/logo-final-improved.png" alt="Logo Juventud Conecta" style="max-width: 100px; opacity: 0.7;" /> 
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

const sendAdminWelcomeEmail = async (email, name) => {
    console.log('Preparando email para dar la bienvenida al administrador', email, name);

    const msg = {
        to: email,
        from: 'no.reply.juventudconecta@gmail.com',
        subject: '¡Bienvenido a Juventud Conecta!',
        text: `Hola ${name}, Eres un administrador de la plataforma Juventud Conecta.`,
        html: `
<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
<h2 style="color: #6C63FF; text-align: center;">¡Bienvenido a Juventud Conecta!</h2>
    <p style="font-size: 16px; color: #333;">
        Hola <strong>${name}</strong>,<br><br>
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
            <img src="https://i.postimg.cc/Pq0YBhJC/logo-final-improved.png" alt="Logo Juventud Conecta" style="max-width: 100px; opacity: 0.7;" /> 
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

module.exports = { sendWelcomeEmail, sendAdminWelcomeEmail }