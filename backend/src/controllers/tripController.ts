import { Request, Response } from 'express';

// Memoria temporal del servidor para sincronizar viajes entre Cliente y Chofer
let tripsDB: any[] = [];
let nextTripId = 100;

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

// 2. Solicitud de Viaje (Cliente la crea)
export const requestTrip = async (req: Request, res: Response) => {
  const { vehicleDetails, licensePlate, pickupAddress, destinationAddress, distanceKm, durationMinutes, totalFare, transmission } = req.body;
  
  const newTrip = {
    id: nextTripId++,
    status: 'requested', // 'requested' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
    vehicleDetails: vehicleDetails || 'Auto genérico',
    licensePlate: licensePlate || 'ABC-123',
    transmission: transmission || 'automatic',
    pickup_address: pickupAddress || 'Ubicación actual',
    destination_address: destinationAddress || 'Destino',
    distance_km: distanceKm || 10,
    duration_minutes: durationMinutes || 20,
    total_fare: totalFare || 250,
    security_pin: Math.floor(1000 + Math.random() * 9000).toString(), // PIN de 4 dígitos para llaves
    created_at: new Date().toISOString()
  };

  tripsDB.unshift(newTrip); // Lo ponemos al principio
  console.log(`🚗 [BACKEND] Nuevo viaje solicitado #${newTrip.id} para ${vehicleDetails} (${licensePlate})`);

  res.json({ 
    status: 'success', 
    trip: newTrip 
  });
};

// 3. Obtener estado de un viaje específico
export const getTripById = async (req: Request, res: Response) => {
  const tripId = parseInt(req.params.id, 10);
  const trip = tripsDB.find(t => t.id === tripId);
  if (!trip) {
    return res.status(404).json({ error: 'Viaje no encontrado' });
  }
  res.json(trip);
};

// 4. Feed de viajes disponibles para el Chofer
export const getDriverFeed = async (req: Request, res: Response) => {
  // Retornamos los viajes que están en estado 'requested'
  const pendingTrips = tripsDB.filter(t => t.status === 'requested');
  res.json(pendingTrips);
};

// 5. El chofer acepta el viaje
export const acceptTrip = async (req: Request, res: Response) => {
  const tripId = parseInt(req.params.id || req.body.tripId, 10);
  const trip = tripsDB.find(t => t.id === tripId);
  
  if (!trip) {
    return res.status(404).json({ status: 'error', message: 'Viaje no encontrado' });
  }

  trip.status = 'assigned';
  console.log(`👨‍✈️ [BACKEND] Viaje #${trip.id} aceptado por el chofer.`);
  res.json({ status: 'success', trip });
};

// 6. Cancelar viaje
export const cancelTrip = async (req: Request, res: Response) => {
  const tripId = parseInt(req.params.id || req.body.tripId, 10);
  const trip = tripsDB.find(t => t.id === tripId);
  if (trip) {
    trip.status = 'cancelled';
  }
  res.json({ status: 'success', trip });
};

export const getTripHistory = async (req: Request, res: Response) => { 
  res.json(tripsDB); 
};

export const rateTrip = async (req: Request, res: Response) => { 
  res.json({ status: 'success' }); 
};

export const verifyPin = async (req: Request, res: Response) => { 
  res.json({ status: 'success' }); 
};

export const completeTrip = async (req: Request, res: Response) => { 
  const tripId = parseInt(req.params.id || req.body.tripId, 10);
  const trip = tripsDB.find(t => t.id === tripId);
  if (trip) {
    trip.status = 'completed';
  }
  res.json({ status: 'success', trip });
};
