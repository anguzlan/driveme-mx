import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db';
import tripRoutes from './routes/tripRoutes';
import { getVehicles, addVehicle, deleteVehicle } from './controllers/vehicleController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER DEFAULT 1,
        brand VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INTEGER NOT NULL,
        license_plate VARCHAR(50) NOT NULL,
        transmission VARCHAR(20) NOT NULL,
        color VARCHAR(50),
        nickname VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS color VARCHAR(50);`);
    await pool.query(`ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS nickname VARCHAR(100);`);
    await pool.query(`ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS transmission VARCHAR(20) DEFAULT 'automatic';`);
    console.log('✅ Base de datos sincronizada: Tabla "vehicles" lista.');
  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos:', error);
  }
};

// Rutas de vehículos definidas directamente para evitar el error de caché
const vehicleRouter = express.Router();
vehicleRouter.get('/', getVehicles);
vehicleRouter.post('/', addVehicle);
vehicleRouter.delete('/:id', deleteVehicle);

app.use('/api/trips', tripRoutes);
app.use('/api/vehicles', vehicleRouter);

app.listen(PORT, async () => {
  await initDatabase();
  console.log(`🚀 DriveMe Home Backend corriendo en http://localhost:${PORT}`);
});
