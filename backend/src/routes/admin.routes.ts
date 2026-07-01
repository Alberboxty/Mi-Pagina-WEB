import express from "express"
//import { verifyToken } from "../middlewares/jwt.middleware"

import { authorizePermission } from "../middlewares/permissions.middleware"

//Routes

//__contenido
import servidoresRoutes from "./servidores.routes"
import newsRoutes from "./news.routes"

//__gestion
import usuariosRoutes from "./usuarios.routes"
import permissionsRoutes from "./permissions.routes"
import rolesRoutes from "./roles.routes"
import rolePermissionsRoutes from "./rolePermissions.routes"
import routesPermissionsRoutes from "./routesPermissions.routes"

//import { PERMISSIONS  } from "../config/permissions"


const router = express.Router()

//router.use(verifyToken)

//contenido
router.use("/servidores", authorizePermission(), servidoresRoutes)
router.use("/noticias", newsRoutes)

//gestion
router.use("/usuarios", authorizePermission(), usuariosRoutes)
router.use('/permisos', authorizePermission(), permissionsRoutes)
router.use('/roles', authorizePermission(), rolesRoutes)
router.use('/rolespermissions', authorizePermission(), rolePermissionsRoutes)
router.use('/routespermissions', authorizePermission(), routesPermissionsRoutes)

export default router