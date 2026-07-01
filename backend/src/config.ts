import 'dotenv/config';

export const PORT = 4000;
export const IP = "localhost";

// DB Info
export const DB_USER = process.env.DB_USER;
export const DB_HOST = process.env.DB_HOST;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_DATABASE = process.env.DB_DATABASE;
export const DB_PORT = process.env.DB_PORT
  ? Number(process.env.DB_PORT)
  : undefined;

// Contenido
export const DB_TABLE_SERVIDORES = process.env.DB_TABLE_SERVIDORES;
export const DB_TABLE_NOTICIAS = process.env.DB_TABLE_NOTICIAS;


// Admin
export const DB_TABLE_USUARIOS = process.env.DB_TABLE_USUARIOS;
export const DB_TABLE_PERMISSIONS = process.env.DB_TABLE_PERMISSIONS;
export const DB_TABLE_ROLES = process.env.DB_TABLE_ROLES;
export const DB_TABLE_ROLE_PERMISSIONS = process.env.DB_TABLE_ROLE_PERMISSIONS;
export const DB_TABLE_ROUTE_PERMISSIONS = process.env.DB_TABLE_ROUTE_PERMISSIONS;

if (!process.env.SECRET_JWT_KEY) {
  throw new Error('SECRET_JWT_KEY no está definida')
}

export const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;

export const EMAIL_MAILER = process.env.EMAIL_MAILER;
export const MAILER_CODE = process.env.MAILER_CODE;