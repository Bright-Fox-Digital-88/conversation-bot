import express from 'express';
import { handleConversationMessage } from '@services/conversation/conversationHandler';

const router = express.Router();

// POST /api/demo/
router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing message field' });
  }

  try {
    const result = await handleConversationMessage(message);
    if (result.success) {
      return res.status(200).json({ status: 'Message processed', conversation: result });
    } else {
      return res.status(500).json({ error: 'Failed to process message', details: result.error });
    }
  } catch (err) {
    console.error('[Demo] Error handling message:', err);
    return res.status(500).json({ error: 'Failed to process message' });
  }
});

export default router;