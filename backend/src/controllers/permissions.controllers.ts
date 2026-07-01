import { pool } from "../db"

import { DB_TABLE_PERMISSIONS } from "../config"

import { Request, Response } from "express"

const permissionColumns = [
    "id_permission", // 0
    "nombre" //1
]


export const obtenerPermisos = async(_req: Request, res: Response) => {

    const { rows } = await pool.query(`SELECT ${permissionColumns} FROM ${DB_TABLE_PERMISSIONS}`);
    console.log("Tabla de permisos:", DB_TABLE_PERMISSIONS)
    return res.status(200).json(rows)
}

export const obtenerPermiso = async(req: Request, res: Response) => {
    const { idpermission } = req.params;
    
    try {
        const result = await pool.query(
            `SELECT ${permissionColumns} FROM ${DB_TABLE_PERMISSIONS} WHERE ${permissionColumns[0]} = $1`,
            [idpermission]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Permiso no encontrado' });
        }

        const permiso = result.rows[0];
        return res.status(200).json(permiso)
    } catch (error){
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener permiso' });
    }

   
}

export const crearPermiso = async(req: Request, res: Response) => {
    const data = req.body;

    const {rows} =  await pool.query(`
        INSERT INTO ${DB_TABLE_PERMISSIONS} 
        ( nombre ) VALUES ( $1 ) 
        ON CONFLICT (nombre) 
        DO NOTHING RETURNING *
    `,
    [
        data.nombre
    ]
    )
    return res.json(rows[0]);
}

export const actualizarPermiso = async(req: Request, res: Response) => {
    const { idpermission } = req.params;
    const data = req.body;
    console.log(permissionColumns[0],permissionColumns[1])
    try {
        const { rows } = await pool.query(
            `
            UPDATE ${DB_TABLE_PERMISSIONS}
            SET ${permissionColumns[1]} = COALESCE($1, ${permissionColumns[1]})
            WHERE ${permissionColumns[0]} = $2
            RETURNING *
            `,
            [
                data.nombre,
                idpermission
            ]
        )
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Permiso no encontrado' });
        }

        return res.status(200).json(rows[0])
    } catch (error){
        console.error(error);
        return res.status(500).json({ error: 'Error al actualizar el permiso' });
    }
    
}

export const eliminarPermiso = async(req: Request, res: Response) => {
    const { idpermission } = req.params;

    try {
        // 1️⃣ Obtener el usuario antes de borrar
        const result = await pool.query(
            `SELECT * FROM ${DB_TABLE_PERMISSIONS} WHERE ${permissionColumns[0]} = $1`,
            [idpermission]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Permiso no encontrado' });
        }

        //const servidor = result.rows[0];

        // 2️⃣ Borrar el registro en la base de datos
        await pool.query(
            `DELETE FROM ${DB_TABLE_PERMISSIONS} WHERE ${permissionColumns[0]} = $1`,
            [idpermission]
        );

        return res.status(200).json({ message: "Permiso eliminado correctamente", idpermission})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al eliminar el permiso' });
    }

    
}