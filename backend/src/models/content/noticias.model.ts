import { pool } from "../../db"
import { DB_TABLE_NOTICIAS, DB_TABLE_USUARIOS } from "../../config"

const isPublicNew = async ( userId?: number, esAdmin?: boolean) => {
    console.log("isPublicNew - userId:", userId, "esAdmin:", esAdmin)
    const result = await pool.query(`
        SELECT 
            ${DB_TABLE_NOTICIAS}.*,
            ${DB_TABLE_USUARIOS}.username AS autor_nombre
        FROM ${DB_TABLE_NOTICIAS}
        LEFT JOIN ${DB_TABLE_USUARIOS} ON ${DB_TABLE_NOTICIAS}.autor_id = ${DB_TABLE_USUARIOS}.id
        WHERE (
            ${DB_TABLE_NOTICIAS}.publicado = true
            OR ${DB_TABLE_NOTICIAS}.autor_id = $1
            OR $2::boolean = true
        )
        ORDER BY ${DB_TABLE_NOTICIAS}.fecha_creacion DESC
        `,
        [userId ?? null, esAdmin ?? false]
    )
    console.log("Filas encontradas:", result.rowCount)

    return result.rows;
}

const isPublicNewID = async ( id: number, userId?: number, esAdmin?: boolean): Promise<boolean> => {
    const result = await pool.query(`
        SELECT 1
        FROM ${DB_TABLE_NOTICIAS} 
        WHERE id = $1 
        AND (
            publicado = true
            OR autor_id = $2
            OR $3::boolean = true
        )
        `,
        [id, userId ?? null, esAdmin ?? false]
    )
    return result.rowCount !== 0;
}

const isEditableNew = async (id: number, userId?: number, esAdmin?: boolean): Promise<boolean> => {
    const result = await pool.query(`
        SELECT 1 
        FROM ${DB_TABLE_NOTICIAS} 
        WHERE id = $1
        AND (
            autor_id = $2    -- es el autor
            OR $3 = true     -- es admin
        )
        `,
        [id, userId ?? null, esAdmin ?? false]
    )
    return result.rowCount !== 0;
}


export const newsModel = {
    isPublicNew,
    isPublicNewID,
    isEditableNew
}


// `SELECT * FROM ${DB_TABLE_NOTICIAS} ${esAdmin ? '' : 'WHERE publicado = true'} ORDER BY fecha_creacion DESC`