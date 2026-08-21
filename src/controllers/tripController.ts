import { Request, Response } from 'express';
import { Pool } from 'pg';

// Configuración de la conexión segura con Supabase
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 1. Calculador de Tarifa Dinámico
export const calculateQuote = (req: Request, res: Response) => {
  const { distanceKm, durationMinutes, isNightMode, transmission } = req.body;
  const baseFare = 50.0;
  const costPerKm = 12.0;
  const costPerMin = 3.0;
  const returnAllowance = 60.0;
  const nightMultiplier = isNightMode ? 1.25 : 1.0;

  const distanceTotal = (distanceKm || 5) * costPerKm;
  const timeTotal = (durationMinutes || 15) * costPerMin;
  const estimatedTotal = (baseFare + distanceTotal + timeTotal + returnAllowance) * nightMultiplier;

  res.json({
    baseFare,
    distanceTotal,
    timeTotal,
    returnAllowance,
    isNightMode: !!isNightMode,
    transmission: transmission || 'automatic',
    estimatedTotal: Math.round(estimatedTotal),
    currency: 'MXN',
  });
};

// 2. Solicitud de Viaje (Guarda directo en Supabase)
export const requestTrip = async (req: Request, res: Response) => {
  const { vehicleDetails, licensePlate, pickupAddress, destinationAddress, distanceKm, durationMinutes, totalFare, transmission } = req.body;
  const securityPin = Math.floor(1000 + Math.random() * 9000).toString();

  try {
    const query = `
      INSERT INTO trips (status, vehicle_details, license_plate, transmission, pickup_address, destination_address, distance_km, duration_minutes, total_fare, security_pin)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const values = [
      'requested',
      vehicleDetails || 'Auto genérico',
      licensePlate || 'ABC-123',
      transmission || 'automatic',
      pickupAddress || 'Ubicación actual',
      destinationAddress || 'Destino',
      distanceKm || 10,
      durationMinutes || 20,
      totalFare || 250,
      securityPin
    ];

    const result = await pool.query(query, values);
    const newTrip = result.rows[0];

    console.log(`🚗 [SUPABASE] Nuevo viaje #${newTrip.id} guardado en la nube para ${newTrip.vehicle_details}`);
    res.json({ status: 'success', trip: newTrip });
  } catch (error) {
    console.error('Error al guardar viaje en Supabase:', error);
    res.status(500).json({ status: 'error', message: 'Error al registrar el viaje' });
  }
};

// 3. Feed de viajes disponibles para el Chofer (Lee de Supabase)
export const getDriverFeed = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM trips WHERE status = 'requested' ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener feed:', error);
    res.status(500).json([]);
  }
};

// 4. El chofer acepta el viaje
export const acceptTrip = async (req: Request, res: Response) => {
  const tripId = parseInt(req.params.id || req.body.tripId, 10);
  try {
    const result = await pool.query(
      "UPDATE trips SET status = 'assigned' WHERE id = $1 RETURNING *;",
      [tripId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Viaje no encontrado' });
    }
    console.log(`👨‍✈️ [SUPABASE] Viaje #${tripId} aceptado.`);
    res.json({ status: 'success', trip: result.rows[0] });
  } catch (error) {
    console.error('Error al aceptar viaje:', error);
    res.status(500).json({ status: 'error', message: 'Error en el servidor' });
  }
};

// Funciones secundarias
export const getTripById = async (req: Request, res: Response) => {
  const tripId = parseInt(req.params.id, 10);
  const result = await pool.query("SELECT * FROM trips WHERE id = $1", [tripId]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
  res.json(result.rows[0]);
};

export const cancelTrip = async (req: Request, res: Response) => {
  const tripId = parseInt(req.params.id || req.body.tripId, 10);
  const result = await pool.query("UPDATE trips SET status = 'cancelled' WHERE id = $1 RETURNING *;", [tripId]);
  res.json({ status: 'success', trip: result.rows[0] });
};

export const completeTrip = async (req: Request, res: Response) => {
  const tripId = parseInt(req.params.id || req.body.tripId, 10);
  const result = await pool.query("UPDATE trips SET status = 'completed' WHERE id = $1 RETURNING *;", [tripId]);
  res.json({ status: 'success', trip: result.rows[0] });
};

export const getTripHistory = async (req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM trips ORDER BY created_at DESC");
  res.json(result.rows);
};

export const rateTrip = async (req: Request, res: Response) => { res.json({ status: 'success' }); };
export const verifyPin = async (req: Request, res: Response) => { res.json({ status: 'success' }); };
