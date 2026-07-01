import express from 'express' // ESModules

import { 
    obtenerPermisos, 
    obtenerPermiso, 
    actualizarPermiso, 
    eliminarPermiso, 
    crearPermiso 
} from '../controllers/permissions.controllers'

const router = express.Router()

router.get('/', obtenerPermisos)

router.get('/:idpermission', obtenerPermiso)

router.post('/', crearPermiso)

router.patch('/:idpermission', actualizarPermiso)

router.delete('/:idpermission', eliminarPermiso)


export default router