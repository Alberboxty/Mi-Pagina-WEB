import { pool } from "../db"

const IsPublicRoute = async ( route: string, method: string): Promise<boolean> => {
    const result = await pool.query(`
        SELECT 1
        FROM route_permissions
        WHERE route = $1
        AND method = $2
        AND is_public = TRUE
        `,
        [route, method]
    )
    return result.rowCount !== 0;
}

const UserHasPermission = async (userId: number, route: string, method: string): Promise<boolean> => {
    const result = await pool.query(`
        SELECT 1
        FROM usuarios
        
        JOIN role_permissions
            ON usuarios.id_rol = role_permissions.id_rol

        JOIN route_permissions
            ON role_permissions.id_permission = route_permissions.id_permission
        
        WHERE usuarios.id = $1
        AND route_permissions.route = $2
        AND route_permissions.method = $3
        `,
        [userId, route, method]
    )

    return result.rowCount !== 0;
}

export default {
    IsPublicRoute,
    UserHasPermission
}