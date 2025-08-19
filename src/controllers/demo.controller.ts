// FABRICATOR PREPEND — DO NOT REMOVE
// Timestamp: 2025-08-18T10:53:09Z
// Spec Version: 1.0
// Target File: /Users/gordonligon/Desktop/dev/conversation-bot/src/controllers/demo.controller.ts
//
// ------------------------------------------------------------------------
//
// STUB PAYLOAD (commented copy follows)
//
// // PATCH: demo accepts targetNumber and optional promptId; requires both RESET and INIT.
// import { Request, Response } from 'express';
// import { aiMessageNew } from '@services/conversation/ai';
// import { resetConversationFor } from '@services/conversation/reset';
//
// export async function handleDemoMessage(req: Request, res: Response): Promise<void> {
//   const { message, targetNumber, From, promptId } = req.body || {};
//   if (!message || typeof message !== 'string') { res.status(400).json({ error: 'Invalid or missing message field' }); return; }
//   if (!From || typeof From !== 'string') { res.status(400).json({ error: 'Missing From (senderPhone)' }); return; }
//   if (!targetNumber) { res.status(400).json({ error: 'Missing targetNumber' }); return; }
//
//   const shouldReset = message.includes('RESET');
//   const shouldInit  = message.includes('INIT');
//
//   if (shouldReset && shouldInit) {
//     resetConversationFor(From);
//     await aiMessageNew(From, promptId, targetNumber);
//     res.status(200).json({ status: 'Demo initiated successfully' });
//   } else {
//     res.status(400).json({ error: 'Demo requires both "RESET" and "INIT" (all caps)' });
//   }
// }
//
// NOTE: Existing file detected. The fabricator header and commented stub were prepended above.
// Original content begins below.
//
import { Request, Response } from 'express';
import { aiMessageNew } from '../services/conversation/ai';
import { resetConversationFor } from '../services/conversation/reset';

export async function handleDemoMessage(req: Request, res: Response): Promise<void> {
  const { message, targetNumber, From, promptId } = req.body || {};
  if (!message || typeof message !== 'string') { res.status(400).json({ error: 'Invalid or missing message field' }); return; }
  if (!From || typeof From !== 'string') { res.status(400).json({ error: 'Missing From (senderPhone)' }); return; }
  if (!targetNumber) { res.status(400).json({ error: 'Missing targetNumber' }); return; }

  const shouldReset = message.includes('RESET');
  const shouldInit  = message.includes('INIT');

  if (shouldReset && shouldInit) {
    resetConversationFor(From);
    await aiMessageNew(From, promptId, targetNumber);
    res.status(200).json({ status: 'Demo initiated successfully' });
  } else {
    res.status(400).json({ error: 'Demo requires both "RESET" and "INIT" (all caps)' });
  }
}

export async function getDemoStatus(req: Request, res: Response): Promise<void> {
  try {
    // TODO: Implement status retrieval using new AI service
    res.status(200).json({ 
      status: 'Status retrieved', 
      conversation: { status: 'demo_mode' }
    });
  } catch (err) {
    console.error('[DemoController] Error getting status:', err);
    res.status(500).json({ error: 'Failed to get conversation status' });
  }
}

export async function resetDemoConversation(req: Request, res: Response): Promise<void> {
  try {
    // TODO: Implement reset using new AI service
    res.status(200).json({ 
      status: 'Conversation reset', 
      conversation: { status: 'reset' }
    });
  } catch (err) {
    console.error('[DemoController] Error resetting conversation:', err);
    res.status(500).json({ error: 'Failed to reset conversation' });
  }
} 