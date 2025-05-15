import nodemailer from 'nodemailer'

const emailOlvidePassword = async (datos) => {
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
        subject: "Reestablece tu Password",
        text: "Reestablece tu Password",
        html: `
                <p>Estimado/a ${nombre},</p>
                <p>Hemos recibido una solicitud para restablecer la contraseña de su cuenta.</p>
                <p>Por favor, haga clic en el siguiente enlace para continuar con el proceso:</p>
                <p>
                    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}" target="_blank" style="color: #4f46e5;">
                    Restablecer contraseña
                    </a>
                </p>
                <p>Si usted no solicitó este cambio, puede ignorar este mensaje.</p>
                <p>Atentamente,<br/>Administración de Pacientes de Veterinaria (APV)</p>
                `
    });

    console.log("Mensaje enviado: %", info.messageId)
}

export default emailOlvidePassword;