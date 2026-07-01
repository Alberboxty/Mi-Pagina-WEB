import { Request, Response } from "express"
import bcryptjs from 'bcryptjs';
import { usuariosModel } from '../models/usuarios.model'
import { messages } from "../messages/messages";

export const recoveryPass = async (req: Request, res: Response) => {
    try {
        //Obtiene token provisional que se ha creado
        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body

        if (!token) {
            res.status(400).json({
                ok: false,
                msg: messages.errors.requireToken
            });
            return;
        }

        if (!newPassword) {
            res.status(400).json({
                ok: false,
                msg: messages.errors.newPass
            });
            return;
        }

        if (!confirmPassword) {
            res.status(400).json({ 
                ok: false, 
                msg: messages.errors.confirmPass
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            res.status(400).json({ 
                ok: false, 
                msg: messages.errors.notMatchPass
            });
            return;
        }

        //Busca el token provisional en la base de datos
        const user = await usuariosModel.findByForgottenToken(token);

        if (!user) {
            res.status(400).json({
                ok: false, 
                msg: messages.errors.isntToken
            });
            return;
        }

        //Verifica si el enlace ha expirado con el token expires
        if (
            !user.forgotten_token_expires_at ||
            user.forgotten_token_expires_at < new Date()
        ){
            res.status(400).json({
                ok: false, 
                msg: messages.errors.expiresLink
            });
            return;
        }

        //Hasheamos la contraseña nueva
        const salt = await bcryptjs.genSalt(10)
        const hashedpassword = await bcryptjs.hash(newPassword, salt)

        //Busca por el token y cambia la contraseña si se cumple.
        await usuariosModel.recoveryPassUser(user.id, hashedpassword);

        res.status(200).json({
            ok: true, 
            msg: messages.success.changedPass
        });
    } catch (error) {
        console.log( error )
        res.status(500).json({
            ok: false,
            msg: messages.errors.serverSleep
        })
        return
    }
};

export const iHaveNotBeenPass = async(req: Request, res: Response) => {
    try {
        const { token } = req.params;

        if (!token) {
            res.status(400).json({
                ok: false,
                msg: messages.errors.requireToken
            });
            return;
        }

        //Busca al usuario por el token
        const user = await usuariosModel.findByForgottenToken(token);

        if (!user) {
            res.status(400).json({
                ok: false, 
                msg: messages.errors.isntToken
            });
            return;
        }

        //Usa la id del usuario para invalidar el token
        await usuariosModel.deleteTokenPass(user.id);

        res.status(200).json({
            ok: true, 
            msg: messages.success.tokenPassInvalidated
        });

    } catch (error) {
        console.log( error )
        res.status(500).json({
            ok: false,
            msg: messages.errors.serverSleep
        })
        return
    }
};