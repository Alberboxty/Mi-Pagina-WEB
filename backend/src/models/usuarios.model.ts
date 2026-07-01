
import { pool } from "../db"

export interface User {
  id: number
  username: string
  email: string
  password: string
  id_rol: number
  forgotten_token: string | null
  forgotten_token_expires_at: Date | null
}

export interface TokenPayload {
  id: number
  email: string
  id_rol: number
}

export interface CreateUserParams {
  username: string
  email: string
  password: string
  id_rol: number
  verification_token: string
  verified: boolean
  forgotten_token: string | null
  forgotten_token_expires_at: Date | null
}

const crearUsuario = async ({ username, email, password, id_rol, verification_token, verified }: CreateUserParams): Promise<User> => {
    const query = {
        text: `
        INSERT INTO usuarios (username, email, password, id_rol, verification_token, verified)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING username, email, id, id_rol, verification_token, verified
        `,
        values: [username, email, password, id_rol, verification_token, verified]
    }
    const { rows } = await pool.query<User>(query)

    console.log("Datos de la base de datos:", rows)

    if (!rows[0]) {
        throw new Error('No se pudo crear el usuario')
    }

    return rows[0]
}

const findOneByEmail = async(email: string): Promise<User | null> => {
    const query = {
        text: `
        SELECT * FROM usuarios
        WHERE EMAIL = $1
        `,
        values: [email]
    }
    const { rows } = await pool.query<User>(query)
    return rows[0] ?? null
}

const findByVerificationToken = async (token: string): Promise<User | null> => {
    const query = {
        text: `
        SELECT * FROM usuarios
        WHERE verification_token = $1
        `,
        values: [token]
    }

    const { rows } = await pool.query<User>(query)
    return rows[0] ?? null
}

const verifyUser = async (token: string): Promise<User | null> => {
    const query = {
        text: `
        UPDATE usuarios
        SET verified = true,
            verification_token = NULL
        WHERE verification_token = $1
        `,
        values: [token]
    }

    const { rows } = await pool.query<User>(query)
    return rows[0] ?? null
}

const forgottenPassUser = async (emailFP: string, forgotten_token: string, expires: Date): Promise<User | null> => {
    const query = {
        text: `
            UPDATE usuarios
            SET forgotten_token = $2,
                forgotten_token_expires_at = $3
            WHERE email = $1
            RETURNING *
        `,
        values: [emailFP, forgotten_token, expires]
    }

    //Falta crear el forgotten_token y forgotten_token_expires_at en la base de datos.

    const { rows } = await pool.query<User>(query)
    return rows[0] ?? null

}

const findByForgottenToken = async (forgotten_token: string): Promise<User | null> => {
    const query = {
        text: `
            SELECT * FROM usuarios WHERE forgotten_token = $1
        `,
        values: [forgotten_token]
    }

    const { rows } = await pool.query<User>(query)
    return rows[0] ?? null
}


const recoveryPassUser = async (id: number, password: string) => {
    const query = {
        text: `
            UPDATE usuarios
            SET password = $2,
                forgotten_token = null,
                forgotten_token_expires_at = null
            WHERE id = $1
            RETURNING *
        `,
        values: [ id, password]
    }

    await pool.query<User>(query)
}

const deleteTokenPass = async (id: number) => {
    const query = {
        text: `
            UPDATE usuarios
            SET forgotten_token = null,
                forgotten_token_expires_at = null
            WHERE id = $1
            RETURNING *
        `,
        values: [ id ]
    }

    await pool.query<User>(query)
}


export const usuariosModel = {
    crearUsuario,
    findOneByEmail,
    findByVerificationToken,
    verifyUser,
    forgottenPassUser,
    findByForgottenToken,
    recoveryPassUser,
    deleteTokenPass
}
