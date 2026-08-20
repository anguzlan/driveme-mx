import { Request, Response } from 'express';
import { pool } from '../db';

export const addVehicle = async (req: Request, res: Response) => {
  const { userId, brand, model, year, licensePlate, transmission, color, nickname } = req.body;
  
  console.log("📥 Datos recibidos en el servidor:", req.body);

  try {
    const ownerId = userId || 1;
    // Forzamos el año a número entero para evitar errores de tipo en PostgreSQL
    const parsedYear = parseInt(year, 10) || 2024;

    const query = `
      INSERT INTO vehicles (user_id, brand, model, year, license_plate, transmission, color, nickname)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    
    const values = [
      ownerId, 
      brand, 
      model, 
      parsedYear, 
      licensePlate, 
      transmission || 'automatic', 
      color || null, 
      nickname || null
    ];

    const result = await pool.query(query, values);
    
    res.json({ status: 'success', vehicle: result.rows[0] });
  } catch (error: any) {
    console.error('❌ Error detallado al guardar vehículo en BD:', error.message);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getVehicles = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM vehicles ORDER BY id DESC;');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener vehículos:', error);
    res.status(500).json({ status: 'error', message: 'Error al consultar vehículos' });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM vehicles WHERE id = $1;', [id]);
    res.json({ status: 'success' });
  } catch (error) {
    console.error('❌ Error al eliminar vehículo:', error);
    res.status(500).json({ status: 'error', message: 'Error al eliminar' });
  }
};
