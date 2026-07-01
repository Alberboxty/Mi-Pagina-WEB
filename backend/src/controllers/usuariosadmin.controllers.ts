import { pool } from "../db"

import { DB_TABLE_USUARIOS } from "../config"

import { Request, Response } from "express"


const userColumns = [
    "id", // 0
    "username", // 1
    "email", // 2
    "create_at", // 3
    "id_rol", // 4
    "verified" // 5
]

export const obtenerUsuarios = async(_req: Request, res: Response) => {

    const { rows } = await pool.query(`SELECT ${userColumns} FROM ${DB_TABLE_USUARIOS}`);
    console.log("Tabla de usuarios:", DB_TABLE_USUARIOS)
    return res.status(200).json(rows)
}

export const obtenerUsuario = async(req: Request, res: Response) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(
            `SELECT ${userColumns} FROM ${DB_TABLE_USUARIOS} WHERE id = $1`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuario = result.rows[0];
        return res.status(200).json(usuario)
    } catch (error){
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener usuario' });
    }

   
}

// export const crearUsuario = async(_req: Request, res: Response) => {
//     return res.status(200).json({ "msg": "crear usuario"})
// }

export const actualizarUsuario = async(req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    console.log(userColumns[0],userColumns[1],userColumns[2], userColumns[3], userColumns[4], userColumns[5])
    try {
        const { rows } = await pool.query(
            `
            UPDATE ${DB_TABLE_USUARIOS}
            SET ${userColumns[1]} = COALESCE($1, ${userColumns[1]}),
                ${userColumns[2]} = COALESCE($2, ${userColumns[2]}),
                ${userColumns[4]} = COALESCE($3, ${userColumns[4]}),
                ${userColumns[5]} = COALESCE($4, ${userColumns[5]})
            WHERE id = $5
            RETURNING *
            `,
            [
                data.username,
                data.email,
                data.id_rol,
                data.verified,
                id
            ]
        )
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return res.status(200).json(rows[0])
    } catch (error){
        console.error(error);
        return res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
    
}

export const eliminarUsuario = async(req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // 1️⃣ Obtener el usuario antes de borrar
        const result = await pool.query(
            `SELECT * FROM ${DB_TABLE_USUARIOS} WHERE id = $1`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        //const servidor = result.rows[0];

        // 2️⃣ Borrar el registro en la base de datos
        await pool.query(
            `DELETE FROM ${DB_TABLE_USUARIOS} WHERE id = $1`,
            [id]
        );

        return res.status(200).json({ message: "Usuario eliminado correctamente", id})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }

    
}