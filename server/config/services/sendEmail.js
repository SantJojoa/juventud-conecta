const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const sendWelcomeEmail = async (email, name) => {
    console.log('Preparando mensaje para:', email, name);
    const msg = {
        to: email,
        from: 'santiago.jojoan@gmail.com',
        subject: '¡Bienvenido a Juventud Conecta!',
        text: `Hola ${name}, !Bienvenido a la plataforma para la juventud, creada por la juventud.`,
        html: `<strong>Hola ${name}</strong>, <br>Gracias por registrarte en nuestra plataforma. <br> <br> Te esperamos para que comiences a disfrutar de todas las funcionalidades que ofrece Juventud Conecta. <br> <br> Saludos cordiales, <br> Juventud Conecta`
    }

    try {
        const result = await sgMail.send(msg);
        console.log('Correo enviado con éxito', result);
        console.log(`Correo enviado a ${email}`);
    } catch (error) {
        console.error('Error al enviar el correo', error.response?.body || error);
    }
}

module.exports = { sendWelcomeEmail }