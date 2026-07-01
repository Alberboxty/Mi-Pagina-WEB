import express from 'express'

import { obtenerRolesPermissions, crearRolePermission, eliminarRolePermission } from '../controllers/rolePermissions.controllers'

const router = express.Router()

router.get('/', obtenerRolesPermissions)

// router.get('/:idpermission', obtenerRolePermission)

router.post('/', crearRolePermission)

// router.patch('/:idpermission', actualizarRolePermissions)

router.delete('/:idRol/:idPermission', eliminarRolePermission)



export default router