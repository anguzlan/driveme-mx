import { Router } from 'express';
import { 
  calculateQuote, 
  requestTrip, 
  getTripById, 
  cancelTrip, 
  getTripHistory, 
  rateTrip, 
  getDriverFeed, 
  acceptTrip, 
  verifyPin, 
  completeTrip 
} from '../controllers/tripController';

const router = Router();

router.post('/quote', calculateQuote);
router.post('/request', requestTrip);
router.post('/cancel', cancelTrip);
router.post('/:id/rate', rateTrip);
router.get('/driver/feed', getDriverFeed);
router.post('/driver/accept', acceptTrip);
router.post('/driver/verify-pin', verifyPin);
router.post('/driver/complete', completeTrip);
router.get('/history/all', getTripHistory);
router.get('/:id', getTripById);

export default router;
