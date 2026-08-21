import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Usamos connectionString para leer directo de Supabase (DATABASE_URL)
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
