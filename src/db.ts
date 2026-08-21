import { Pool } from 'pg';

// Ponemos la URL directamente para ignorar Render y su caché
export const pool = new Pool({
  connectionString: 'postgresql://postgres.tahmobalaiyvshhxsltz:Megacable23%23@aws-0-us-west-2.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});
