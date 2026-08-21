import { Pool } from 'pg';
import dotenv from 'dotenv';
import dns from 'node:dns';

// 🚀 EL TRUCO MAESTRO: Obliga a Node.js (Render) a usar IPv4 en toda la aplicación
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
