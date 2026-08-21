import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: 'postgresql://postgres.tahmobalaiyvshhxsltz:Megacable23%23@aws-0-us-west-2.pooler.supabase.com:6543/postgres',
  ssl: {
    rejectUnauthorized: false
  },
  family: 4
});
