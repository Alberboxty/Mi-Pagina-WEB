import { pool } from "../db"

import { DB_TABLE_NOTICIAS, DB_TABLE_USUARIOS } from "../config"

import { Request, Response } from "express"

import { User } from "../models/usuarios.model";

import { newsModel } from "../models/content/noticias.model"

import { TokenPayload } from '../models/usuarios.model';

import fs from 'fs';
import path from 'path';

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

export const crearNoticia = async (req: Request &{user?: User}, res: Response) => {
    const data = req.body;
    const file = req.file;

    if (!file) {
        res.status(400).json({ ok: false, msg: 'Archivo imagen requerido' });
        return
    }

    try {
        const imagePath = `/uploads/noticias/${file.filename}`;

        const autorId = req.user?.id

        console.log("Usuario ID Noticias", autorId)
            
        const {rows} = await pool.query(
            `
                INSERT INTO ${DB_TABLE_NOTICIAS} (
                    imagen, 
                    titulo, 
                    asunto, 
                    descripcion, 
                    version, 
                    autor_id
                ) VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING *
            `, 
            [ 
                imagePath,
                data.titulo, 
                data.asunto, 
                data.descripcion, 
                data.version,
                autorId
            ]
        );
        console.log(rows)
        
        return res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, msg: 'Error al crear la noticia.' });
    }
}

export const actualizarNoticia = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const file = req.file;

    try {
        // Resolver la imagen
        let imagePath = data.imagenActual || null; // opcionalmente puedes enviar la ruta actual desde el frontend
        if (file) {
            imagePath = `/uploads/noticias/${file.filename}`;

            // borrar imagen antigua del disco (si existe)
            if (data.imagenActual) {
                // const fs = require('fs');
                const oldPath = `${process.cwd()}${data.imagenActual}`;
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        // Ejecutar UPDATE directo
        const { rows } = await pool.query(
        `
        UPDATE ${DB_TABLE_NOTICIAS}
        SET imagen = COALESCE($1, imagen),
            titulo = COALESCE($2, titulo),
            asunto = COALESCE($3, asunto),
            descripcion = COALESCE($4, descripcion),
            version = COALESCE($5, version)
        WHERE id = $6
        RETURNING *
        `,
        [   
            imagePath,
            data.titulo,
            data.asunto,
            data.descripcion,
            data.version,
            id
        ]
        );

        if (rows.length === 0) {
            return res.status(404).json({ ok: false, msg: 'Servidor no encontrado' });
        }

        return res.json(rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, msg: 'Error al actualizar servidor' });
    }
}

export const eliminarNoticia = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    try {
        // 1️⃣ Obtener el servidor antes de borrar
        const result = await pool.query(
            `SELECT * FROM ${DB_TABLE_NOTICIAS} WHERE id = $1`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ ok: false, msg: 'Noticia no encontrada' });
        }

        const noticia = result.rows[0];

        // 2️⃣ Borrar la imagen del disco si existe
        if (noticia.imagen) {
            const imagePath = path.join(process.cwd(), noticia.imagen);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // 3️⃣ Borrar el registro en la base de datos
        await pool.query(
            `DELETE FROM ${DB_TABLE_NOTICIAS} WHERE id = $1`,
            [id]
        );

        return res.json({ ok: true, msg: 'Noticia eliminada correctamente', id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, msg: 'Error al eliminar la noticia' });
    }
}

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
        return res.status(500).json({ ok: false, msg: 'Error al publicar la noticia' });
    }
}