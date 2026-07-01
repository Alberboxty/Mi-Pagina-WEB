import { pool } from "../db"

interface Role {
  id_rol: number
  rol_name: string
}

const findById = async(id: number): Promise<Role | null> => {
    const query = {
        text: `
        SELECT * FROM roles
        WHERE id_rol = $1
        `,
        values: [id]
    }
    
    const { rows } = await pool.query<Role>(query)
    return rows[0] || null


}

export const rolesModel = {
    findById
}
