import express from 'express' // ESModules

import { obtenerUsuarios, obtenerUsuario, actualizarUsuario, eliminarUsuario } from '../controllers/usuariosadmin.controllers'    
//import { verifyToken } from '../middlewares/jwt.middleware'
//import { authorizePermission } from '../middlewares/permissions.middleware'


const router = express.Router()

// router.get('/', verifyToken, authorizePermission(PERMISSIONS.SERVIDOR_VER), obtenerServidores)

//verifyToken, authorizePermission(PERMISSIONS.USUARIOS_VER),

router.get('/', obtenerUsuarios)

router.get('/:id', obtenerUsuario)

// router.post('/', crearUsuario)

router.patch('/:id', actualizarUsuario)

router.delete('/:id', eliminarUsuario);

export default router
