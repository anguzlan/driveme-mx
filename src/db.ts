import { Pool } from 'pg';

console.log("🚩 ¡LEYENDO DB.TS CORRECTO! INICIANDO EN PUERTO 6543 🚩");

// Borrar cualquier variable de entorno de Render que confunda a la base de datos
delete process.env.PGHOST;
delete process.env.PGPORT;
delete process.env.DATABASE_URL;

export const pool = new Pool({
  host: 'aws-0-us-west-2.pooler.supabase.com',
  port: 6543,
  user: 'postgres.tahmobalaiyvshhxsltz',
  password: 'Megacable23#',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
  family: 4
});
