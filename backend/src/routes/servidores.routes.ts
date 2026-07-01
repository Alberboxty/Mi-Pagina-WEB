import express from 'express' // ESModules

import { createUpload } from '../middlewares/upload'

import { 
    obtenerServidores,
    crearServidores,
    obtenerServidor,
    actualizarServidor,
    eliminarServidor
} from '../controllers/servidores.controllers'

//import { verifyToken } from "../middlewares/jwt.middleware"

//import { authorizePermission } from "../middlewares/permissions.middleware"

//import { PERMISSIONS  } from "../config/permissions"

//import * as servidoresServices from '../services/servidoresServices'
//import toNewServidoresEntry from '../utils'

//const express = require('express') -> commonjs



const router = express.Router()

const upload = createUpload('servidores')

router.get('/', obtenerServidores)

router.get('/:id', obtenerServidor)

router.post('/', upload.single("imagen"), crearServidores)

router.patch('/:id', upload.single('imagen'), actualizarServidor)

router.delete('/:id', eliminarServidor);

export default router