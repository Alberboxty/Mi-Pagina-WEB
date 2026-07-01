import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';
import {SECRET_JWT_KEY} from '../config'
import {TokenPayload} from '../models/usuarios.model'



export const verifyToken = (req: Request &{user?:object} , res: Response, next: NextFunction) => {
    let authHeader = req.cookies["access-token"];

    if (!authHeader) {
        res.status(401).json({error: "Token no se ha obtenido."})
        return
    }

    try {
        const decoded = jwt.verify(authHeader, SECRET_JWT_KEY) as TokenPayload

        req.user = { 
            id: decoded.id,
            email: decoded.email,
            id_rol: decoded.id_rol
        }
        console.log("req.user:", req.user)

        
        console.log(`Se ha obtenido el token${authHeader}`)
        next();
    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok: false,
            msg: 'Token inválido.'
        })
        return
    }
    
}

