import { Router } from 'express';
import conversationRoutes from './conversation.routes';

const router = Router();

// Mount all routes
router.use('/conversation', conversationRoutes);

export default router; 