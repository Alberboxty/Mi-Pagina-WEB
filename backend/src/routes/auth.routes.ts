import express from 'express' // ESModules

import { obtenerUsuarios } from '../controllers/usuariosadmin.controllers'

import { 
    // obtenerUsuarios, 
    // obtenerUsuarioID, 
    // crearUsuario, 
    // actualizarUsuario, 
    // eliminarUsuario 
    registrarse,
    iniciarSesion,
    perfil,
    logout,
    soloAdmin,
    forgottenPassMail
} from '../controllers/usuarios.controllers'

import { validarRegistro, validarEmail, validarUsuariosAPI, validarLoggeo } from '../validators/usuarios.validators'

import { validarCampos } from '../middlewares/validation.middleware'

import { verifyToken } from '../middlewares/jwt.middleware'

const router = express.Router()

// router.get('/', obtenerUsuarios)

// router.get('/:id', obtenerUsuarioID)

// router.post('/', crearUsuario)

// router.patch('/:id', actualizarUsuario)

// router.delete('/:id', eliminarUsuario)

router.post('/registrarse', validarRegistro, validarCampos, registrarse)
router.post('/iniciar-sesion', validarLoggeo, validarCampos, iniciarSesion)
router.get('/perfil', verifyToken, perfil)
router.post('/logout', logout)
router.get('/admin/data', verifyToken, soloAdmin)

router.post('/forgottenpass', validarEmail, validarCampos, forgottenPassMail)

router.get('/usuarios', validarUsuariosAPI, validarCampos, obtenerUsuarios)

export default router