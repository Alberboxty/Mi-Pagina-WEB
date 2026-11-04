import { pool } from "../db"

import { DB_TABLE_NOTICIAS, DB_TABLE_USUARIOS } from "../config"

import { Request, Response } from "express"

import { newsModel } from "../models/content/noticias.model"

import { TokenPayload } from '../models/usuarios.model';

import { removeUploadedFile, deleteStoredImage } from "../utils/uploads";

export const obtenerNoticias = async (req: Request, res: Response) => {
    const user = (req as any).user as TokenPayload | undefined;
    const esAdmin = user?.id_rol === 2;
    const userId = user?.id;
    console.log("Es admin?", esAdmin)
    console.log("Es usuarioID?", userId)
    try {
        const rows = await newsModel.isPublicNew(userId, esAdmin);
        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener noticias' });
    }
}

export const obtenerNoticia = async (req: Request, res: Response) => {
    const { id } = req.params; // capturamos el id de la URL
    const user = (req as any).user as TokenPayload | undefined;
    const esAdmin = user?.id_rol === 2;
    const userId = user?.id;

    try {
        const newAccess = await newsModel.isPublicNewID(Number(id), userId, esAdmin);

        if (!newAccess) {
            return res.status(403).json({ error: 'No tienes permiso para ver esta noticia' });
        }

        const result = await pool.query(
            `
            SELECT 
                ${DB_TABLE_NOTICIAS}.*,
                ${DB_TABLE_USUARIOS}.username AS autor_nombre
            FROM ${DB_TABLE_NOTICIAS} 
            LEFT JOIN ${DB_TABLE_USUARIOS} ON ${DB_TABLE_NOTICIAS}.autor_id = ${DB_TABLE_USUARIOS}.id
            WHERE ${DB_TABLE_NOTICIAS}.id = $1
            `,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Noticia no encontrada' });
        }

        const servidor = result.rows[0];

        return res.json(servidor);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener servidor' });
    }
}

export const crearNoticia = async (req: Request, res: Response) => {
    const file = req.file;

    const user = (req as any).user as TokenPayload | undefined;

    if (!file) {
        return res.status(400).json({ ok: false, msg: 'Archivo imagen requerido' });
    }

    try {
        const imagePath = `/uploads/noticias/${file.filename}`;
        const autorId = user?.id;

        // descripcion ya viene limpia del validador
        const { titulo, asunto, descripcion, version } = req.body;

        const { rows } = await pool.query(
            `
            INSERT INTO ${DB_TABLE_NOTICIAS} (
                imagen, titulo, asunto, descripcion, version, autor_id
            ) VALUES ($1, $2, $3, $4::jsonb, $5, $6)
            RETURNING *
            `,
            [imagePath, titulo, asunto, descripcion, version, autorId]
        );

        return res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);
        removeUploadedFile(req);
        return res.status(500).json({ ok: false, msg: 'Error al crear la noticia.' });
    }
};

export const actualizarNoticia = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const file = req.file;
    const user = (req as any).user as TokenPayload | undefined;
    const esAdmin = user?.id_rol === 2;

    if (!Number.isInteger(id)) {
        removeUploadedFile(req);
        return res.status(400).json({ ok: false, msg: 'Datos no válidos' });
    }

    try {
        // Propiedad: solo el autor o un admin
        const puedeEditar = await newsModel.isEditableNew(id, user?.id, esAdmin);

        if (!puedeEditar) {
            removeUploadedFile(req);
            return res.status(403).json({ ok: false, msg: 'No tienes permiso para editar esta noticia' });
        }

        // La imagen anterior se lee de la BD, nunca del body
        const actual = await pool.query(
            `SELECT imagen FROM ${DB_TABLE_NOTICIAS} WHERE id = $1`,
            [id]
        );

        if (actual.rowCount === 0) {
            removeUploadedFile(req);
            return res.status(404).json({ ok: false, msg: 'Noticia no encontrada' });
        }

        const imagenAnterior: string | null = actual.rows[0].imagen;

        // Solo una ruta generada por el servidor, o null para conservar la actual
        const nuevaImagen = file ? `/uploads/noticias/${file.filename}` : null;

        // Solo los campos esperados; descripcion ya viene limpia del validador
        const { titulo, asunto, descripcion, version } = req.body;

        const { rows } = await pool.query(
            `
            UPDATE ${DB_TABLE_NOTICIAS}
            SET imagen = COALESCE($1, imagen),
                titulo = COALESCE($2, titulo),
                asunto = COALESCE($3, asunto),
                descripcion = COALESCE($4::jsonb, descripcion),
                version = COALESCE($5, version)
            WHERE id = $6
            RETURNING *
            `,
            [
                nuevaImagen,
                titulo ?? null,
                asunto ?? null,
                descripcion ?? null,
                version ?? null,
                id
            ]
        );

        // Solo se borra la imagen vieja si se subió una nueva y el UPDATE fue bien
        if (file) deleteStoredImage(imagenAnterior);

        return res.json(rows[0]);
    } catch (error) {
        console.error(error);
        removeUploadedFile(req);
        return res.status(500).json({ ok: false, msg: 'Error al actualizar la noticia' });
    }
};

export const eliminarNoticia = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const user = (req as any).user as TokenPayload | undefined;
    const esAdmin = user?.id_rol === 2;

    if (!Number.isInteger(id)) {
        return res.status(400).json({ ok: false, msg: 'Datos no válidos' });
    }

    try {
        const puedeEditar = await newsModel.isEditableNew(id, user?.id, esAdmin);

        if (!puedeEditar) {
            return res.status(403).json({ ok: false, msg: 'No tienes permiso para eliminar esta noticia' });
        }

        // Primero el registro; la imagen solo se borra si el DELETE fue bien
        const { rows } = await pool.query(
            `DELETE FROM ${DB_TABLE_NOTICIAS} WHERE id = $1 RETURNING imagen`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ ok: false, msg: 'Noticia no encontrada' });
        }

        deleteStoredImage(rows[0].imagen);

        return res.json({ ok: true, msg: 'Noticia eliminada correctamente', id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, msg: 'Error al eliminar la noticia' });
    }
};

export const publicarNoticia = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = (req as any).user as TokenPayload | undefined;
    const esAdmin = user?.id_rol === 2;
    const userId = user?.id;

    try {
        const newEditAccess = await newsModel.isEditableNew(Number(id), userId, esAdmin);
        
        if (!newEditAccess) {
            res.status(403).json({ error: 'No tienes permiso para editar esta noticia' });
            return 
        }

        const { rows } = await pool.query(
            `UPDATE ${DB_TABLE_NOTICIAS} SET publicado = true WHERE id = $1 RETURNING *`,
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ ok: false, msg: 'Noticia no encontrada' });
        return res.json({ ok: true, noticia: rows[0] });
    } catch (error) {
        return res.status(500).json({ ok: false, msg: 'Error al publicar la noticia' });
    }
}

export const despublicarNoticia = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = (req as any).user as TokenPayload | undefined;
    const esAdmin = user?.id_rol === 2;
    const userId = user?.id;

    try {
        const newEditAccess = await newsModel.isEditableNew(Number(id), userId, esAdmin);
        
        if (!newEditAccess) {
            res.status(403).json({ error: 'No tienes permiso para editar esta noticia' });
            return 
        }

        const { rows } = await pool.query(
            `UPDATE ${DB_TABLE_NOTICIAS} SET publicado = false WHERE id = $1 RETURNING *`,
            [id]
        );
        
        if (rows.length === 0) return res.status(404).json({ ok: false, msg: 'Noticia no encontrada' });
        return res.json({ ok: true, noticia: rows[0] });
    } catch (error) {
        return res.status(500).json({ ok: false, msg: 'Error al despublicar la noticia' });
    }
}