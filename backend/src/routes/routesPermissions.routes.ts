import express from 'express' // ESModules

import { 
    obtenerRoutesPermissions, 
    obtenerRoutePermission, 
    actualizarRoutePermission, 
    eliminarRoutePermission, 
    crearRoutePermission 
} from '../controllers/routesPermissions.controllers'

const router = express.Router()

router.get('/', obtenerRoutesPermissions)

router.get('/:idRoutePermission', obtenerRoutePermission)

router.post('/', crearRoutePermission)

router.patch('/:idRoutePermission', actualizarRoutePermission)

router.delete('/:idRoutePermission', eliminarRoutePermission)

export default router