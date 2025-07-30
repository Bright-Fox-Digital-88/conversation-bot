import { handleConversationWithReset, handleConversationMessage as handleConversationMessageService } from '@services/conversation/conversationHandler';
import { Request, Response } from 'express';

// Twilio message handler
export async function handleTwilioMessage(message: string): Promise<void> {
  // Parse commands at the controller level
  const shouldReset = message.toLowerCase().includes('reset');
  const shouldInit = message.toLowerCase().includes('init');
  
  console.log('[ConversationController] Processing Twilio message:', {
    message,
    shouldReset,
    shouldInit
  });
  
  // Handle reset + init combination
  if (shouldReset && shouldInit) {
    console.log('[ConversationController] Reset + Init command detected');
    await handleConversationWithReset(true, true);
  }
  // Handle reset only
  else if (shouldReset) {
    console.log('[ConversationController] Reset command detected');
    await handleConversationWithReset(true, false);
  }
  // Handle init only
  else if (shouldInit) {
    console.log('[ConversationController] Init command detected');
    await handleConversationWithReset(false, true);
  }
  // Normal conversation flow
  else {
    console.log('[ConversationController] Normal conversation flow');
    await handleConversationWithReset(false, false);
  }
}

// HTTP conversation message handler
export async function handleConversationMessage(req: Request, res: Response): Promise<void> {
  const { Body } = req.body;

  if (!Body || typeof Body !== 'string') {
    res.status(400).json({ error: 'Invalid or missing Body field' });
    return;
  }

  console.log('[ConversationController] Received webhook:', Body);
  
  try {
    // Parse commands at the controller level
    const shouldReset = Body.toLowerCase().includes('reset');
    const shouldInit = Body.toLowerCase().includes('init');
    
    let result: {
      success: boolean;
      message?: string;
      currentIndex?: number;
      totalMessages?: number;
      error?: string;
    };
    
    // Handle reset + init combination
    if (shouldReset && shouldInit) {
      console.log('[ConversationController] Reset + Init command detected');
      result = await handleConversationWithReset(true, true);
    }
    // Handle reset only
    else if (shouldReset) {
      console.log('[ConversationController] Reset command detected');
      result = await handleConversationWithReset(true, false);
    }
    // Handle init only
    else if (shouldInit) {
      console.log('[ConversationController] Init command detected');
      result = await handleConversationWithReset(false, true);
    }
    // Normal conversation flow
    else {
      console.log('[ConversationController] Normal conversation flow');
      result = await handleConversationMessageService(Body);
    }
    
    if (result.success) {
      console.log('[ConversationController] Conversation message processed successfully:', result);
      res.status(200).json({ 
        status: 'Message received and processed',
        conversation: result
      });
    } else {
      console.error('[ConversationController] Conversation message processing failed:', result.error);
      res.status(500).json({ 
        error: 'Failed to process message',
        details: result.error
      });
    }
    
  } catch (err) {
    console.error('[ConversationController] Error handling conversation message:', err);
    res.status(500).json({ error: 'Failed to process message' });
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
