import nodemailer from "nodemailer"

import { EMAIL_MAILER, MAILER_CODE } from '../config'

export const emailForgottenPass = async (email: string, token: string) =>{
    try{
        //Ponemos los datos del servidor mailer.
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
            auth: {
                user: EMAIL_MAILER,
                pass: MAILER_CODE,
            },
        });

        //Link con token provisional 
        const recoveryPass = `http://localhost:5173/auth/recovery/${token}`;

        const IHaveNotBeen = `http://localhost:4000/recoveryPass/IHaveNotBeen/${token}`

        //Información para enviar al cliente para que verifique el email junto al link anterior.
        const info = {
            from: EMAIL_MAILER, // sender address
            to: email, // list of recipients
            subject: "LokuraPlay | Recuperación de contrasñea", // subject line
            html: `
                <h2>¿Has intentado recuperar la contraseña?</h2>
                <p>Si no quieres recuperar la contraseña o no lo has pedido tu, clica este enlace:</p>
                <a href="${IHaveNotBeen}">
                    ¡Yo no fui!
                </a>
                <p>Esta opción es importante para invalidar posibles cambios no deseados.</p>
                <br>
                <p><b>Enlace real:</b> ${IHaveNotBeen} </p>
                <br>
                <br>
                <p>Haz clic en el enlace:</p>
                <a href="${recoveryPass}">
                    Recuperar contraseña
                </a>
                <br>
                <p><b>Enlace real:</b> ${recoveryPass} </p>
            `, // HTML body
        };

        //Enviar email con la información.
        await transporter.sendMail(info);

        //Verificar en consola si se ha enviado el email
        console.log("Email enviado.")

    } catch (error) {
        console.error("Error al enviar el email.", error)
    }
}