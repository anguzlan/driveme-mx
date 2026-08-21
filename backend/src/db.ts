import { Pool } from 'pg';

console.log("🚩 ¡LEYENDO EL ARCHIVO DB.TS CORRECTO (PUERTO 6543)! 🚩");

// Eliminamos las variables de entorno temporalmente para que Node no lea la URL vieja de Render
delete process.env.PGHOST;
delete process.env.PGPORT;
delete process.env.DATABASE_URL;

export const pool = new Pool({
  host: 'aws-0-us-west-2.pooler.supabase.com',
  port: 6543,
  user: 'postgres.tahmobalaiyvshhxsltz',
  password: 'Megacable23#', // Lo ponemos normal, sin el %23
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
  family: 4
});
