import express from 'express' // ESModules

import { obtenerRoles, obtenerRol, actualizarRol, eliminarRol, crearRol } from '../controllers/roles.controllers'

const router = express.Router()

router.get('/', obtenerRoles)

router.get('/:idrol', obtenerRol)

router.post('/', crearRol)

router.patch('/:idrol', actualizarRol)

router.delete('/:idrol', eliminarRol)


export default router