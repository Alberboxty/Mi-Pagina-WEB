
import { Request, Response } from "express"

import { usuariosModel } from '../models/usuarios.model'

import jwt from 'jsonwebtoken'

import { SECRET_JWT_KEY } from '../config'

import bcryptjs from 'bcryptjs';

import { CreateUserParams } from '../models/usuarios.model'

import { rolesModel } from '../models/roles.model'

import {emailValidator} from '../services/email.services'

import { emailForgottenPass } from "../services/emailFP.services";

import crypto from "crypto";

import { messages } from "../messages/messages";

// export const obtenerUsuarios = async (_req: Request, res: Response) => {
//     res.send("Obtenemos usuarios")
// };

// export const obtenerUsuarioID = async (_req: Request, res: Response) => {
//     res.send("Obtenemos usuarios por id")
// };

// export const crearUsuario = async (_req: Request, res: Response) => {
//     res.send("Creamos usuarios")
// };

// export const actualizarUsuario = async (_req: Request, res: Response) => {
//     res.send("Actualizamos usuarios")
// };

// export const eliminarUsuario = async (_req: Request, res: Response) => {
//     res.send("Eliminamos usuarios")
// };


// (req: Request<{}, {}, CreateUserParams>, res: Response): Promise<void>

export const registrarse = async (req: Request<{}, {}, CreateUserParams>, res: Response): Promise<void> => {
    try{
        const { username, email, password } = req.body     

        // Conexión a base de datos.
        const useremail = await usuariosModel.findOneByEmail(email)
        if (useremail) {
            res.status(409).json({ 
                ok: false,
                msg: messages.errors.existEmail
            })
            return
        }


        // Hashear Contraseña
        const salt = await bcryptjs.genSalt(10)
        const hashedpassword = await bcryptjs.hash(password, salt)
        

        //Crea token provisional para validar email
        const verificationToken = crypto
            .randomBytes(32)
            .toString("hex");
        console.log(`Token mailer: ${verificationToken}`)

        // Nuevo Usuario
        const rolPrincipal = 1;

        const newUser = await usuariosModel.crearUsuario({
            username, 
            email, 
            password: hashedpassword, 
            id_rol: rolPrincipal,
            verification_token: verificationToken,
            verified: false,
            forgotten_token: null,
            forgotten_token_expires_at: null
        })


        //Envia un correo de verificacion al email con su token provisional
        await emailValidator(
            email,
            verificationToken
        );

        //Valida si el rol se puede usar o no
        const rolExist = await rolesModel.findById(rolPrincipal);
        if (!rolExist) {
            res.status(400).json({ ok: false, msg: messages.errors.isntRol });
            return 
        }

        //Este token no tengo ni idea, porque luego se hace el login igual.
        const token = jwt.sign(
            { email: newUser.email },
            SECRET_JWT_KEY,
            { expiresIn: '1h'}
        );

        //Cuando nos registramos y todo esta correcto devuelve el token.
        res.status(201).json({ ok: true, msg: token })

    } catch (error) {
        //Error externo al servidor.
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: messages.errors.serverSleep
        })
        return
    }
};

export const iniciarSesion = async (req: Request, res: Response) => {
    try{
        const { email, password } = req.body

        // VALIDACIONES
        if ( !email || !password) {
            res.status(400).json({
                ok: false,
                msg: messages.errors.isntEmailAndPass
            });
            return 
        }

        const useremail = await usuariosModel.findOneByEmail(email)
        if (!useremail) {
            res.status(409).json({ 
                ok: false,
                msg: messages.errors.instEmail2
            })
            return
        }

        const isMatch = await bcryptjs.compare(password, useremail.password)

        if(!isMatch) {
            res.status(401).json({ ok: false, msg: messages.errors.isntLogin })
            return
        }

        const token = jwt.sign(
            { 
                id: useremail.id,
                email: useremail.email,
                id_rol: useremail.id_rol
            },
            SECRET_JWT_KEY,
            { expiresIn: '1h'}
        );
        
        res
            .cookie("access-token", token, {
                httpOnly: true,
                sameSite: true,
                maxAge: 1000 * 60 * 60
            })
            .status(201).json({ ok: true, msg: token })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: messages.errors.serverSleep
        })
        return      
    }
};


export const perfil = async (req: Request &{ user?: {email?:string}}, res: Response) => {
    try {
        if (!req.user?.email) {
            res.status(401).json({ ok: false, msg: messages.errors.unauthenticated })
            return 
        }

        const user = await usuariosModel.findOneByEmail(req.user.email);

        if (!user) {
            res.status(404).json({ ok: false, msg: messages.errors.userNotFound });
            return
        }

        res.status(200).json({
            ok: true,
            email: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        });
        return
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: messages.errors.serverSleep
        })
        return
        
    }
};

export const logout = async(_req: Request, res: Response) => {
    res.clearCookie("access-token", {
        httpOnly: true,
        sameSite: true
    }).json({
        ok: true,
        msg: messages.errors.logOut
    });
}

interface AuthUser {
  id: number
  id_rol: number
}

// interface AuthRequest extends Request {
//   email?: AuthUser
// }

export const soloAdmin = async(req: Request &{ user?: {email?: AuthUser, id_rol?: number}}, res: Response) => {
    if (!req.user?.email) {
        res.status(401).json({ msg: messages.errors.unauthenticated })
        return
    }
    if (!req.user?.id_rol) {
        res.status(401).json({ msg: messages.errors.isntRol })
        return
    }
    
    if (req.user.id_rol !== 2) {
        res.status(403).json({ msg: messages.errors.unauthorized })
        return
    }
    res.json({ secretData: "Pito" })
}

export const forgottenPassMail = async (req: Request, res: Response) => {
    try {
        const { emailFP } = req.body
        console.log( "emailFP:", emailFP )
        if (!emailFP) {
            res.status(409).json({ 
                ok: false,
                msg: messages.errors.requireMail
            })
            return
        }

        //Consulta si el email existe o no
        const compareMail = await usuariosModel.findOneByEmail(emailFP);

        //Si no existe
        if (!compareMail) {
            res.status(200).json({ ok: true, msg: messages.success.sentemail + `${emailFP}` })
            return;
        }
        // Si el token esta activo
            

        if (
            compareMail.forgotten_token !== null && 
            compareMail.forgotten_token_expires_at !== null && 
            compareMail.forgotten_token_expires_at > new Date()
        ) {
            //Reenvia el mismo token, sin tocar la BD
            await emailForgottenPass(
                emailFP,
                compareMail.forgotten_token
            );
            res.status(200).json({ ok: true, msg: messages.success.sentemail + `${emailFP}` })
            return;
        }

        //Crea token provisional para validar email
        const ForgottenPassToken = crypto
            .randomBytes(32)
            .toString("hex");
        const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos
        
        const addTokenUser = await usuariosModel.forgottenPassUser(emailFP, ForgottenPassToken, expires)
        
        if (!addTokenUser) {
            res.status(200).json({ ok: true, msg: messages.success.sentemail + `${emailFP}` });
            return
        }

        await emailForgottenPass(
            emailFP,
            ForgottenPassToken
        );
        
        res.status(200).json({ ok: true, msg: messages.success.sentemail + `${emailFP}` })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: messages.errors.serverSleep
        })
        return  
    }
}


