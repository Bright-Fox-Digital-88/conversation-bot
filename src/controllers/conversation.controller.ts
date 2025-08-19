// FABRICATOR PREPEND — DO NOT REMOVE
// Timestamp: 2025-08-18T10:49:41Z
// Spec Version: 1.0
// Target File: /Users/gordonligon/Desktop/dev/conversation-bot/src/controllers/conversation.controller.ts
//
// ------------------------------------------------------------------------
//
// STUB PAYLOAD (commented copy follows)
//
// // PATCH: route Twilio 'From' as senderPhone; call ai services per branch.
// import { Request, Response } from 'express';
// import { aiMessageNew, aiMessage } from '@services/conversation/ai';
// import { resetConversationFor } from '@services/conversation/reset';
//
// export async function handleConversationMessage(req: Request, res: Response) {
//   const { Body, From, targetNumber, promptId } = req.body || {};
//   if (!From || typeof From !== 'string') {
//     res.status(400).json({ error: 'Missing Twilio From (senderPhone)' });
//     return;
//   }
//   const senderPhone = From;
//
//   try {
//     const text = typeof Body === 'string' ? Body : '';
//     const shouldReset = text.toLowerCase().includes('reset');
//     const shouldInit  = text.toLowerCase().includes('init');
//
//     if (shouldReset && shouldInit) {
//       resetConversationFor(senderPhone);
//       await aiMessageNew(senderPhone, promptId, targetNumber);
//       res.status(200).json({ ok: true, branch: 'reset+init' });
//       return;
//     }
//     if (shouldReset) {
//       resetConversationFor(senderPhone);
//       res.status(200).json({ ok: true, branch: 'reset' });
//       return;
//     }
//     if (shouldInit) {
//       await aiMessageNew(senderPhone, promptId, targetNumber);
//       res.status(200).json({ ok: true, branch: 'init' });
//       return;
//     }
//
//     if (!text.trim()) {
//       res.status(400).json({ error: 'Invalid or missing Body' });
//       return;
//     }
//     await aiMessage(senderPhone, text);
//     res.status(200).json({ ok: true, branch: 'normal' });
//   } catch (err: any) {
//     console.error('[ConversationController]', err);
//     res.status(500).json({ error: err?.message || 'Unhandled error' });
//   }
// }
//
// NOTE: Existing file detected. The fabricator header and commented stub were prepended above.
// Original content begins below.
//
import { aiMessageNew, aiMessage } from '@services/conversation/ai';
import { resetConversationFor } from '@services/conversation/reset';
import { Request, Response } from 'express';



// HTTP conversation message handler - S6 Implementation
export async function handleConversationMessage(req: Request, res: Response): Promise<void> {
  const { Body, From, targetNumber, promptId } = req.body || {};
  
  if (!From || typeof From !== 'string') {
    res.status(400).json({ error: 'Missing Twilio From (senderPhone)' });
    return;
  }
  const senderPhone = From;

  try {
    const text = typeof Body === 'string' ? Body : '';
    const shouldReset = text.toLowerCase().includes('reset');
    const shouldInit = text.toLowerCase().includes('init');

    console.log('[ConversationController] Processing Twilio message:', {
      senderPhone,
      text,
      shouldReset,
      shouldInit,
      targetNumber,
      promptId
    });

    if (shouldReset && shouldInit) {
      console.log('[ConversationController] Reset + Init command detected');
      resetConversationFor(senderPhone);
      await aiMessageNew(senderPhone, promptId, targetNumber);
      res.status(200).json({ ok: true, branch: 'reset+init' });
      return;
    }
    if (shouldReset) {
      console.log('[ConversationController] Reset command detected');
      resetConversationFor(senderPhone);
      res.status(200).json({ ok: true, branch: 'reset' });
      return;
    }
    if (shouldInit) {
      console.log('[ConversationController] Init command detected');
      if (!targetNumber) {
        res.status(400).json({ error: 'targetNumber required for init flows' });
        return;
      }
      await aiMessageNew(senderPhone, promptId, targetNumber);
      res.status(200).json({ ok: true, branch: 'init' });
      return;
    }

    if (!text.trim()) {
      res.status(400).json({ error: 'Invalid or missing Body' });
      return;
    }
    
    console.log('[ConversationController] Normal conversation flow');
    await aiMessage(senderPhone, text);
    res.status(200).json({ ok: true, branch: 'normal' });
  } catch (err: any) {
    console.error('[ConversationController]', err);
    res.status(500).json({ error: err?.message || 'Unhandled error' });
  }
}

// Twilio status callback handler
export async function handleTwilioStatusCallback(req: Request, res: Response): Promise<void> {
  console.log('[ConversationController] 📞 Received Twilio status callback:', {
    MessageSid: req.body.MessageSid,
    MessageStatus: req.body.MessageStatus,
    To: req.body.To,
    From: req.body.From,
    ErrorCode: req.body.ErrorCode,
    ErrorMessage: req.body.ErrorMessage,
    Timestamp: new Date().toISOString()
  });

  // Log the full callback payload for debugging
  console.log('[ConversationController] 📋 Full callback payload:', req.body);

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
}
