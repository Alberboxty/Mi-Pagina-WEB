import { Request, Response, NextFunction } from "express"
import permisosModel from "../models/permisos.model"
import { verifyToken } from "../middlewares/jwt.middleware"

interface AuthRequest extends Request {
  user?: {
    id: number,
    email: string
  }
}

export const authorizePermission = () => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try{
            // Construir ruta real
            const normalizeRoute = (route: string): string => {
                return route.replace(/\/\d+/g, "/:id")
            }

            const route = normalizeRoute(req.originalUrl.split("?")[0]!.replace(/\/$/, ""));

            // Metodo HTTP
            const method = req.method

            console.log("Route:", route)
            console.log("Method:", method)

            // Si es publico:
            const IsPublic = await permisosModel.IsPublicRoute(route, method)
            // Verificar que exista

            console.log("isPublic", IsPublic)
            if (IsPublic) {
                next()
                return
            }

            //Sino
            //verificar token

            await new Promise<void>((resolve, reject) => {
                verifyToken(req, res, (err?: any) => {
                    if (err) reject(err)
                    else resolve()
                })
            })

            // Usuario desde el JSONWEBTOKEN
            const userId = req.user?.id;

            console.log("User:", userId)

            // Verifica si lo tiene
            if (!userId) {
                res.status(401).json({
                    error: "Usuario no autenticado"
                })
                return
            }

            //Llamar al model
            const hasPermission = await permisosModel.UserHasPermission( userId, route, method)

            console.log("haspermission:", hasPermission)
            if (!hasPermission) {
                res.status(403).json({ error: "No tienes permiso para esta ruta. "})
                return
            }

            next()
        } catch (error) {
            console.error("Error en authorizePermission:",error);
            console.error("userId:", req.user?.id);
            console.error("route:", req.originalUrl.split("?")[0]?.replace(/\/$/, ""));
            console.error("method", req.method);
            res.status(500).json({ error: `Error verificando permisos.` });
        }
    }
}




// export const authorizePermission = (permission: string) => {
//     return async (req: AuthRequest, res: Response, next: NextFunction) => {
//         if (!req.email) {
//             res.status(401).json({ msg: "No autenticado" })
//             return
//         }
//         try {
//             const permisos = await permisosModel.getUserPermissions(req.email)

//             if (!permisos.includes(permission)) {
//                 res.status(403).json({ msg: "No autorizado" })
//                 return
//             }

//             next()
//         } catch (error) {
//             console.error(error)
//             res.status(500).json({ msg: "Error verificando permisos" })
//         }
//     }
    
// }