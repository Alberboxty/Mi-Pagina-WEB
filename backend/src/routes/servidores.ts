import express from 'express' // ESModules

import { 
    obtenerServidores
} from '../controllers/servidores.controllers'

//import * as servidoresServices from '../services/servidoresServices'
//import toNewServidoresEntry from '../utils'

//const express = require('express') -> commonjs

const router = express.Router()

router.get('/', obtenerServidores)

router.get('/:id', (_req, res) => {
    res.send("Respuesta al metodo get con id")
})

router.post('/', (_req, res) => {
    res.send('Respuesta al metodo post');
})

export default router