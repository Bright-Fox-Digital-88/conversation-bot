import express from 'express';
import { 
  handleConversationMessage, 
  handleTwilioStatusCallback 
} from '@controllers/index';

const router = express.Router();

// POST /api/conversation/ - Handle conversation messages
router.post('/', handleConversationMessage);

// POST /api/conversation/twilio/status - Twilio status callback
router.post('/twilio/status', handleTwilioStatusCallback);

export default router;
