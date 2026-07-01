
import { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer"
import { EMAIL_MAILER, MAILER_CODE } from '../config'

//tocar mañana
export const emailTest = async (_req: Request, res: Response, next: NextFunction) =>{
    try{
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
            auth: {
                user: EMAIL_MAILER,
                pass: MAILER_CODE,
            },
        });

        const info = {
            from: EMAIL_MAILER, // sender address
            to: "ahc2000v@gmail.com", // list of recipients
            subject: "Eres puto", // subject line
            text: "Texto", // plain text body
            html: "<b>Lo siento mucho, pero te tengo que decir que eres puto XDDDD</b>", // HTML body
        };

        await transporter.sendMail(info);
        console.log("Email enviado.")
        res.json({
            message: "Ruta ejecutada y email enviado 📧",
        });
        next();

    }catch (error){
        console.error("Error al enviar el email.", error)
        next();
    }
}



