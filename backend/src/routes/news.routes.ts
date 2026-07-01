import express from 'express' // ESModules

import { createUpload } from '../middlewares/upload'

import { verifyToken } from '../middlewares/jwt.middleware'

import {
    obtenerNoticias,
    obtenerNoticia,
    crearNoticia,
    actualizarNoticia,
    eliminarNoticia
} from '../controllers/news.controllers'


const router = express.Router()

const upload = createUpload('noticias')

router.get('/', obtenerNoticias)

router.get('/:id', obtenerNoticia)

router.post(
    '/', 
    verifyToken,
    upload.single("imagen"), 
    crearNoticia
)

router.patch(
    '/:id', 
    upload.single('imagen'), 
    actualizarNoticia)

router.delete('/:id', eliminarNoticia);

export default router