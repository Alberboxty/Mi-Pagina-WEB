import { pool } from "../db"

import { DB_TABLE_ROUTE_PERMISSIONS } from "../config"

import { Request, Response } from "express"

const routePermissionColumns = [
    "id_route_permission", // 0
    "route", //1
    "method", //2
    "id_permission",//3
    "is_public"//4
]


export const obtenerRoutesPermissions = async(_req: Request, res: Response) => {
    const { rows } = await pool.query(`SELECT ${routePermissionColumns} FROM ${DB_TABLE_ROUTE_PERMISSIONS}`);
    console.log("Tabla de routePermission:", DB_TABLE_ROUTE_PERMISSIONS)
    return res.status(200).json(rows)
}

export const obtenerRoutePermission = async(req: Request, res: Response) => {
    const { idRoutePermission } = req.params;
    
    try {
        const result = await pool.query(
            `SELECT ${routePermissionColumns} FROM ${DB_TABLE_ROUTE_PERMISSIONS} WHERE ${routePermissionColumns[0]} = $1`,
            [idRoutePermission]
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

export const crearRoutePermission = async(req: Request, res: Response) => {
    const data = req.body;

    const {rows} =  await pool.query(`
        INSERT INTO ${DB_TABLE_ROUTE_PERMISSIONS} ( 
            ${routePermissionColumns[1]}, 
            ${routePermissionColumns[2]}, 
            ${routePermissionColumns[3]},
            ${routePermissionColumns[4]}
        ) VALUES ( $1 , $2 , $3, $4 )
    `,
    [
        data.route,
        data.method,
        data.id_permission,
        data.is_public
    ]
    )
    return res.json(rows[0]);
}

export const actualizarRoutePermission = async(req: Request, res: Response) => {
    const { idRoutePermission } = req.params;
    const data = req.body;
    console.log(routePermissionColumns[0],routePermissionColumns[1])
    try {
        const { rows } = await pool.query(
            `
            UPDATE ${DB_TABLE_ROUTE_PERMISSIONS}
            SET ${routePermissionColumns[1]} = COALESCE($1, ${routePermissionColumns[1]}),
            ${routePermissionColumns[2]} = COALESCE($2, ${routePermissionColumns[2]}),
            ${routePermissionColumns[3]} = COALESCE($3, ${routePermissionColumns[3]}),
            ${routePermissionColumns[4]} = COALESCE($4, ${routePermissionColumns[4]})
            WHERE ${routePermissionColumns[0]} = $5
            RETURNING *
            `,
            [
                data.route,
                data.method,
                data.id_permission,
                data.is_public,
                idRoutePermission
            ]
        )
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'routePermission no encontrado' });
        }

        return res.status(200).json(rows[0])
    } catch (error){
        console.error(error);
        return res.status(500).json({ error: 'Error al actualizar el routePermission' });
    }
    
}

export const eliminarRoutePermission = async(req: Request, res: Response) => {
    const { idRoutePermission } = req.params;

    try {
        // 1️⃣ Obtener el usuario antes de borrar
        const result = await pool.query(
            `SELECT * FROM ${DB_TABLE_ROUTE_PERMISSIONS} WHERE ${routePermissionColumns[0]} = $1`,
            [idRoutePermission]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'RoutePermission no encontrado' });
        }

        //const servidor = result.rows[0];

        // 2️⃣ Borrar el registro en la base de datos
        await pool.query(
            `DELETE FROM ${DB_TABLE_ROUTE_PERMISSIONS} WHERE ${routePermissionColumns[0]} = $1`,
            [idRoutePermission]
        );

        return res.status(200).json({ message: "RoutePermission eliminado correctamente", idRoutePermission})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al eliminar el RoutePermission' });
    }
}

