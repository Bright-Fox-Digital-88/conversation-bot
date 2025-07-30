import express from 'express';
import { handleConversationMessage, getConversationStatus, resetConversation } from '@services/conversation/conversationHandler';

const router = express.Router();

router.post('/', async (req, res) => {
  const { Body } = req.body;

  if (!Body || typeof Body !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing Body field' });
  }

  console.log('[HTTP] Received webhook:', Body);
  
  try {
    // Process the conversation message directly in the main process
    const result = await handleConversationMessage(Body);
    
    if (result.success) {
      console.log('[HTTP] Conversation message processed successfully:', result);
      return res.status(200).json({ 
        status: 'Message received and processed',
        conversation: result
      });
    } else {
      console.error('[HTTP] Conversation message processing failed:', result.error);
      return res.status(500).json({ 
        error: 'Failed to process message',
        details: result.error
      });
    }
    
  } catch (err) {
    console.error('[HTTP] Error handling conversation message:', err);
    return res.status(500).json({ error: 'Failed to process message' });
  }
});

// New endpoint to get conversation status
router.get('/status', (req, res) => {
  try {
    const status = getConversationStatus();
    res.status(200).json({
      status: 'success',
      data: status
    });
  } catch (error) {
    console.error('[HTTP] Error getting conversation status:', error);
    res.status(500).json({ error: 'Failed to get conversation status' });
  }
});

// New endpoint to reset conversation
router.post('/reset', (req, res) => {
  try {
    const result = resetConversation();
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    console.error('[HTTP] Error resetting conversation:', error);
    res.status(500).json({ error: 'Failed to reset conversation' });
  }
});

// ✅ New: Status callback endpoint for delivery updates
router.post('/twilio/status', (req, res) => {
  console.log('[HTTP] 📞 Received Twilio status callback:', {
    MessageSid: req.body.MessageSid,
    MessageStatus: req.body.MessageStatus,
    To: req.body.To,
    From: req.body.From,
    ErrorCode: req.body.ErrorCode,
    ErrorMessage: req.body.ErrorMessage,
    Timestamp: new Date().toISOString()
  });

  // Log the full callback payload for debugging
  console.log('[HTTP] 📋 Full callback payload:', req.body);

  // Handle different status types
  switch (req.body.MessageStatus) {
    case 'delivered':
      console.log('✅ Message delivered successfully!');
      break;
    case 'undelivered':
      console.error('❌ Message undelivered!', {
        ErrorCode: req.body.ErrorCode,
        ErrorMessage: req.body.ErrorMessage
      });
      break;
    case 'failed':
      console.error('💥 Message failed!', {
        ErrorCode: req.body.ErrorCode,
        ErrorMessage: req.body.ErrorMessage
      });
      break;
    case 'sent':
      console.log('📤 Message sent to carrier');
      break;
    case 'queued':
      console.log('⏳ Message queued for delivery');
      break;
    default:
      console.log(`ℹ️ Message status: ${req.body.MessageStatus}`);
  }

  // Always respond with 200 to acknowledge receipt
  res.status(200).send('OK');
});

export default router;
