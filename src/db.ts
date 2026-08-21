import { Pool } from 'pg';

export const pool = new Pool({
  host: 'aws-0-us-west-2.pooler.supabase.com',
  port: 6543,
  user: 'postgres.tahmobalaiyvshhxsltz',
  password: 'Megacable23#',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
  family: 4
});
