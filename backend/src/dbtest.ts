import { pool } from './db';
// import { DB_USER, DB_HOST, DB_PASSWORD, DB_DATABASE, DB_PORT } from './config'

// function credenciales() {
//   console.log("Estos son los datos de la base de datos.")
//   console.log("Usuario: ", DB_USER)
//   console.log("Host: ", DB_HOST)
//   console.log("Pass: ", DB_PASSWORD)
//   console.log("DB: ", DB_DATABASE)
//   console.log("Puerto: ", DB_PORT)

// }

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a la base de datos exitosa');
    // Opcional: prueba una consulta rápida
    const res = await client.query('SELECT NOW()');
    console.log('Hora del servidor DB:', res.rows[0]);
    client.release();
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
  } finally {
    await pool.end(); // cierra el pool
  }
}


//export const credencialess = credenciales();
export const test = testConnection();