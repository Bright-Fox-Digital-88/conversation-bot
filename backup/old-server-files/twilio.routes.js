const express = require('express');
const { spawn } = require('child_process');

const router = express.Router();

router.post('/twilio', (req, res) => {
  const { Body } = req.body;

  if (!Body || typeof Body !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing Body field' });
  }

  console.log('[HTTP] Received Twilio webhook:', Body);
  
  try {
    // Spawn dedicated Twilio handler process for state management
    const child = spawn('npx', ['ts-node', 'src/services/twilio/twilio-handler.js', Body]);
    
    child.on('close', (code) => {
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

module.exports = router; 