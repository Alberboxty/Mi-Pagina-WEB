import { pool } from "../db"

import { DB_TABLE_SERVIDORES } from "../config"

import { Request, Response } from "express"

import fs from 'fs';
import path from 'path';

export const obtenerServidores = async (_req: Request, res: Response) => {
    const { rows } = await pool.query(`SELECT * FROM ${DB_TABLE_SERVIDORES}`);
    return res.status(200).json(rows);
};

export const obtenerServidor = async (req: Request, res: Response) => {
    const { id } = req.params; // capturamos el id de la URL

    try {
        const result = await pool.query(
            `SELECT * FROM ${DB_TABLE_SERVIDORES } WHERE id = $1`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Servidor no encontrado' });
        }

        const servidor = result.rows[0];

        return res.json(servidor);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener servidor' });
    }
};

export const crearServidores = async (req: Request, res: Response) => {
    const data = req.body;
    const file = req.file;

    if (!file) {
        res.status(400).json({ ok: false, msg: 'Archivo imagen requerido' });
        return
    }

    try {
        const imagePath = `/uploads/servidores/${file.filename}`;
            
        const {rows} = await pool.query(
            `INSERT INTO ${DB_TABLE_SERVIDORES} (nombre_servidor, estado, ip, imagen, description) VALUES ($1, $2, $3, $4, $5) RETURNING *`, 
            [ 
                data.nombre_servidor, 
                data.estado, 
                data.ip, 
                imagePath, 
                data.description
            ]
        );
        console.log(rows)
        
        return res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, msg: 'Error al crear servidor.' });
    }
    
};

export const actualizarServidor = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const file = req.file;

    try {
        // Resolver la imagen
        let imagePath = data.imagenActual || null; // opcionalmente puedes enviar la ruta actual desde el frontend
        if (file) {
            imagePath = `/uploads/servidores/${file.filename}`;

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
        UPDATE servidores
        SET nombre_servidor = COALESCE($1, nombre_servidor),
            estado = COALESCE($2, estado),
            ip = COALESCE($3, ip),
            imagen = COALESCE($4, imagen),
            description = COALESCE($5, description)
        WHERE id = $6
        RETURNING *
        `,
        [
            data.nombre_servidor,
            data.estado,
            data.ip,
            imagePath,
            data.description,
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

export const eliminarServidor = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // 1️⃣ Obtener el servidor antes de borrar
        const result = await pool.query(
            'SELECT * FROM servidores WHERE id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ ok: false, msg: 'Servidor no encontrado' });
        }

        const servidor = result.rows[0];

        // 2️⃣ Borrar la imagen del disco si existe
        if (servidor.imagen) {
            const imagePath = path.join(process.cwd(), servidor.imagen);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // 3️⃣ Borrar el registro en la base de datos
        await pool.query(
            'DELETE FROM servidores WHERE id = $1',
            [id]
        );

        return res.json({ ok: true, msg: 'Servidor eliminado correctamente', id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, msg: 'Error al eliminar servidor' });
    }
}


// export const actualizarServidor = async (req:Request, res: Response) => {
//     const { id } = req.params;
//     const data = req.body;
//     const file = req.file;

    
// };

 

// nombre_servidor
// estado
// ip
// imagen
// description