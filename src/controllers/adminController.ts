import { Request, Response } from 'express';
import { pool } from '../db';

export const getAdminMetrics = async (_req: Request, res: Response) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_trips,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_trips,
        COUNT(*) FILTER (WHERE status = 'in_progress') as active_trips,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_trips,
        COALESCE(SUM(total_fare) FILTER (WHERE status = 'completed'), 0) as gross_revenue,
        COALESCE(AVG(rating) FILTER (WHERE rating IS NOT NULL), 5.0) as avg_rating
      FROM trips;
    `;

    const driversCountQuery = `
      SELECT COUNT(*) as active_drivers FROM users WHERE role = 'driver';
    `;

    const [statsRes, driversRes] = await Promise.all([
      pool.query(statsQuery),
      pool.query(driversCountQuery),
    ]);

    const stats = statsRes.rows[0];
    const grossRevenue = parseFloat(stats.gross_revenue);
    const platformFee = Math.round(grossRevenue * 0.20);
    const driverPayouts = Math.round(grossRevenue * 0.80);

    res.json({
      totalTrips: parseInt(stats.total_trips, 10),
      completedTrips: parseInt(stats.completed_trips, 10),
      activeTrips: parseInt(stats.active_trips, 10),
      cancelledTrips: parseInt(stats.cancelled_trips, 10),
      grossRevenue,
      platformFee,
      driverPayouts,
      avgRating: parseFloat(stats.avg_rating).toFixed(1),
      activeDrivers: parseInt(driversRes.rows[0].active_drivers, 10) || 4,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener métricas', error });
  }
};

export const getAdminLiveTrips = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.full_name as client_name, u.phone as client_phone,
              v.brand as vehicle_brand, v.model as vehicle_model, v.license_plate, v.transmission
       FROM trips t
       JOIN users u ON t.client_id = u.id
       LEFT JOIN vehicles v ON t.vehicle_id = v.id
       ORDER BY t.created_at DESC
       LIMIT 50;`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al consultar despacho', error });
  }
};
