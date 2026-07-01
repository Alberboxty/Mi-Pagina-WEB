import { Request, Response } from "express"
import { usuariosModel } from '../models/usuarios.model'

export const emailVerification = async (req: Request, res: Response) => {
    //Obtiene token provisional que se ha creado
    const { token } = req.params;

    if (!token) {
        res.status(400).send("Token requerido");
        return;
    }

    //Busca el token provisional
    const user = await usuariosModel.findByVerificationToken(token);

    if (!user) {

        res.status(400).send("Token inválido");
        return;

    }

    //Busca por el token y asigna true al verificado y elimina el token
    await usuariosModel.verifyUser(token);

    res.send("Cuenta verificada correctamente ✅");
};