import express from 'express';
import { spawn } from 'child_process';

const router = express.Router();

router.post('/twilio', (req, res) => {
  const { Body } = req.body;

  if (!Body || typeof Body !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing Body field' });
  }

  console.log('[HTTP] Received Twilio webhook:', Body);
  
  try {
    // Spawn dedicated Twilio handler process for state management with path resolution
    const child = spawn('npx', ['ts-node', '-r', 'tsconfig-paths/register', 'src/services/twilio/twilio-handler.ts', Body]);
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
      console.log('[HTTP] Child stdout:', data.toString());
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
      console.log('[HTTP] Child stderr:', data.toString());
    });
    
    child.on('close', (code) => {
      console.log('[HTTP] Child process exited with code:', code);
      console.log('[HTTP] Child stdout:', stdout);
      console.log('[HTTP] Child stderr:', stderr);
      
      if (code === 0) {
        console.log('[HTTP] Twilio message processed successfully');
        return res.status(200).json({ status: 'Message received and processed' });
      } else {
        console.error('[HTTP] Twilio message processing failed');
        return res.status(500).json({ error: 'Failed to process message' });
      }
    });
    
    child.on('error', (err) => {
      console.error('[HTTP] Error spawning child process:', err);
      return res.status(500).json({ error: 'Failed to process message' });
    });
    
  } catch (err) {
    console.error('[HTTP] Error handling Twilio message:', err);
    return res.status(500).json({ error: 'Failed to process message' });
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
