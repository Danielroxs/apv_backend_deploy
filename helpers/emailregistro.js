import nodemailer from 'nodemailer'

const emailregistro = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos

    // Enviar el email
    const info = await transporter.sendMail({
        from: "APV - Administrador de Pacientes de Veterinaria",
        to: email,
        subject: "Comprueba tu Cuenta en APV",
        html: `
            <p>Hola ${nombre},</p>
            <p>Gracias por registrarte en APV. Para confirmar tu cuenta, haz clic en el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}" target="_blank">Confirmar Cuenta</a>
            <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
        `
    });

    console.log("Mensaje enviado: %", info.messageId)
}

export default emailregistro;