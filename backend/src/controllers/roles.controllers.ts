import { pool } from "../db"

import { DB_TABLE_ROLES } from "../config"

import { Request, Response } from "express"

const rolColumns = [
    "id_rol", // 0
    "rol_name" //1
]


export const obtenerRoles = async(_req: Request, res: Response) => {

    const { rows } = await pool.query(`SELECT ${rolColumns} FROM ${DB_TABLE_ROLES}`);
    console.log("Tabla de roles:", DB_TABLE_ROLES)
    return res.status(200).json(rows)
}

export const obtenerRol = async(req: Request, res: Response) => {
    const { idrol } = req.params;
    
    try {
        const result = await pool.query(
            `SELECT ${rolColumns} FROM ${DB_TABLE_ROLES} WHERE ${rolColumns[0]} = $1`,
            [idrol]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        const permiso = result.rows[0];
        return res.status(200).json(permiso)
    } catch (error){
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener Rol' });
    }

   
}

export const crearRol = async(req: Request, res: Response) => {
    const data = req.body;

    const {rows} =  await pool.query(`
        INSERT INTO ${DB_TABLE_ROLES} 
        ( ${rolColumns[1]} ) 
        VALUES ( $1 )
    `,
    [
        data.rol_name
    ]
    )
    return res.json(rows[0]);
}

export const actualizarRol = async(req: Request, res: Response) => {
    const { idrol } = req.params;
    const data = req.body;
    console.log(rolColumns[0],rolColumns[1])
    try {
        const { rows } = await pool.query(
            `
            UPDATE ${DB_TABLE_ROLES}
            SET ${rolColumns[1]} = COALESCE($1, ${rolColumns[1]})
            WHERE ${rolColumns[0]} = $2
            RETURNING *
            `,
            [
                data.nombre,
                idrol
            ]
        )
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        return res.status(200).json(rows[0])
    } catch (error){
        console.error(error);
        return res.status(500).json({ error: 'Error al actualizar el Rol' });
    }
    
}

export const eliminarRol = async(req: Request, res: Response) => {
    const { idrol } = req.params;

    try {
        // 1️⃣ Obtener el usuario antes de borrar
        const result = await pool.query(
            `SELECT * FROM ${DB_TABLE_ROLES} WHERE ${rolColumns[0]} = $1`,
            [idrol]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        //const servidor = result.rows[0];

        // 2️⃣ Borrar el registro en la base de datos
        await pool.query(
            `DELETE FROM ${DB_TABLE_ROLES} WHERE ${rolColumns[0]} = $1`,
            [idrol]
        );

        return res.status(200).json({ message: "Permiso eliminado correctamente", idrol})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al eliminar el Rol' });
    }

    
}