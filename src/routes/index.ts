import { Router } from 'express';
import demoRoutes from './demo.routes';
import twilioRoutes from './twilio.routes';

const router = Router();

// Mount all routes
router.use('/demo', demoRoutes);
router.use('/twilio', twilioRoutes);

export default router; 