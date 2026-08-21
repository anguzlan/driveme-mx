import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: 'db.tahmobalaiyvshhxsltz.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: process.env.DB_PASSWORD || 'Megacable23#', // O puedes usar process.env.DATABASE_URL si prefieres, pero esto fuerza IP y evita IPv6
  ssl: {
    rejectUnauthorized: false
  },
  family: 4
});
