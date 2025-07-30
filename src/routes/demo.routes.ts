import express from 'express';
import { handleDemoMessage, getDemoStatus } from '@controllers/index';

const router = express.Router();

// POST /api/demo/ - Handle conversation messages (requires both RESET and INIT)
router.post('/', handleDemoMessage);

// GET /api/demo/status - Get conversation status
router.get('/status', getDemoStatus);

export default router;