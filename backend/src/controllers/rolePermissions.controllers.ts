import { pool } from "../db"

// import { DB_TABLE_ROLE_PERMISSIONS } from "../config"

import { Request, Response } from "express"


export const obtenerRolesPermissions = async(_req: Request, res: Response) => {
    try{
        const {rows} = await pool.query(`
            SELECT
                roles.id_rol,
                roles.rol_name AS role,
                permissions.id_permission,
                permissions.nombre AS permission

            FROM role_permissions 

            JOIN roles
                ON role_permissions.id_rol = roles.id_rol
            
            JOIN permissions
                ON role_permissions.id_permission = permissions.id_permission
            
            ORDER BY roles.id_rol;
        
        `)

        return res.status(200).json(rows);
    } catch (error) {
        console.error("Error al obtener roles y permisos", error);

        return res.status(500).json({
            error: 'Error al obtener roles y permisos'
        });
    }
}

export const crearRolePermission = async(req: Request, res: Response) => {
    const { idRol, idPermission } = req.body;

    try {
        await pool.query(
            `
                INSERT INTO role_permissions
                (id_rol, id_permission)
                VALUES ($1, $2)
            `,
            [idRol, idPermission]
        );

        return res.status(201).json({
            message: 'Permiso asignado al rol'
        });
    } catch (error){
        console.error(error);
        return res.status(500).json({ error: 'Error al crear rol / permiso' });
    }
}

export const eliminarRolePermission = async(req: Request, res: Response) => {
    const { idRol, idPermission } = req.params;
    console.log("ID Rol", idRol)
    console.log("ID Permission", idPermission)
    try {

        
        const result = await pool.query(
            `
                DELETE FROM role_permissions
                WHERE id_rol = $1
                AND id_permission = $2
            `,
            [idRol, idPermission]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Permiso no encontrado' });
        }

        return res.status(200).json({ message: "Rol / Permiso eliminado correctamente"})

    }catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al eliminar el Rol / Permiso' });
    }
}

// export const obtenerPermiso = async(req: Request, res: Response) => {
//     const { idpermission } = req.params;
    
    
// }

// export const actualizarPermiso = async(req: Request, res: Response) => {
//     const { idpermission } = req.params;
//     const data = req.body;

// }

// export const eliminarPermiso = async(req: Request, res: Response) => {
//     const { idpermission } = req.params;

    
// }