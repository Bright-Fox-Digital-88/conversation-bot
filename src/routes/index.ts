import { Router } from 'express';
import conversationRoutes from './conversation.routes';
import demoRoutes from './demo.routes';

const router = Router();

// Mount all routes
router.use('/conversation', conversationRoutes);
router.use('/demo', demoRoutes);

export default router; 