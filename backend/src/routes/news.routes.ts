import express from 'express' // ESModules

import { createUpload } from '../middlewares/upload'

import { verifyToken, verifyTokenAccess } from '../middlewares/jwt.middleware'

import {
    obtenerNoticias,
    obtenerNoticia,
    crearNoticia,
    actualizarNoticia,
    eliminarNoticia,
    publicarNoticia,
    despublicarNoticia
} from '../controllers/news.controllers'


const router = express.Router()

const upload = createUpload('noticias')


// RUTA: /admin/noticias
router.get(
    '/', 
    verifyTokenAccess, 
    obtenerNoticias
)

// RUTA: /admin/noticias/:id
router.get(
    '/:id', 
    verifyTokenAccess, 
    obtenerNoticia
)

// RUTA: /admin/noticias
router.post(
    '/', 
    verifyToken,
    upload.single("imagen"), 
    crearNoticia
)

// RUTA: /admin/noticias/:id
router.patch(
    '/:id', 
    upload.single('imagen'), 
    actualizarNoticia
)

// RUTA: /admin/noticias/:id
router.delete(
    '/:id', 
    eliminarNoticia
);

// RUTA: /admin/noticias/:id/publicar
router.patch(
    '/:id/publicar', 
    publicarNoticia
)

// RUTA: /admin/noticias/:id/despublicar
router.patch(
    '/:id/despublicar', 
    despublicarNoticia
)

export default router