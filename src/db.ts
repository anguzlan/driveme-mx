import { Pool } from 'pg';

export const pool = new Pool({
  // Nota el puerto 6543, es el correcto para el Pooler de Supabase
  connectionString: 'postgresql://postgres.tahmobalaiyvshhxsltz:Megacable23%23@aws-0-us-west-2.pooler.supabase.com:6543/postgres',
  ssl: {
    rejectUnauthorized: false
  },
  family: 4 // ¡ESTO ES VITAL PARA BLOQUEAR LA RUTA IPv6 EN RENDER!
});
