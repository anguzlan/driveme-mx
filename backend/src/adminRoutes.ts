import { Router } from 'express';
import { getAdminMetrics, getAdminLiveTrips } from '../controllers/adminController';

const router = Router();

router.get('/metrics', getAdminMetrics);
router.get('/live-trips', getAdminLiveTrips);

export default router;
