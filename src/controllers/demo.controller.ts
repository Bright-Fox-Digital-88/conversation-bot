import { handleConversationMessage, handleConversationWithReset, getConversationStatus, resetConversation } from '@services/conversation/conversationHandler';
import { Request, Response } from 'express';

export async function handleDemoMessage(req: Request, res: Response): Promise<void> {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Invalid or missing message field' });
    return;
  }

  try {
    console.log('[DemoController] Processing message:', message);
    
    // Parse commands at the controller level - must be ALL CAPS
    const shouldReset = message.includes('RESET');
    const shouldInit = message.includes('INIT');
    const shouldStatus = message.toLowerCase().includes('status');
    
    // Handle status request
    if (shouldStatus) {
      console.log('[DemoController] Status request detected');
      const status = getConversationStatus();
      res.status(200).json({ 
        status: 'Status retrieved', 
        conversation: status 
      });
      return;
    }
    
    // Demo ONLY accepts reset + init combination
    if (shouldReset && shouldInit) {
      console.log('[DemoController] Reset + Init command detected - proceeding with demo');
      const result = await handleConversationWithReset(true, true);
      
      if (result.success) {
        res.status(200).json({ 
          status: 'Demo initiated successfully', 
          conversation: result 
        });
      } else {
        res.status(500).json({ 
          error: 'Failed to initiate demo', 
          details: result.error 
        });
      }
    } else {
      // Demo requires both reset and init - return error if missing either
      console.log('[DemoController] Invalid demo command - missing RESET or INIT');
      res.status(400).json({ 
        error: 'Demo requires both "RESET" and "INIT" commands in the message (all caps)',
        received: {
          hasReset: shouldReset,
          hasInit: shouldInit
        }
      });
    }
  } catch (err) {
    console.error('[DemoController] Error handling message:', err);
    res.status(500).json({ error: 'Failed to process message' });
  }
}

export async function getDemoStatus(req: Request, res: Response): Promise<void> {
  try {
    const status = getConversationStatus();
    res.status(200).json({ 
      status: 'Status retrieved', 
      conversation: status 
    });
  } catch (err) {
    console.error('[DemoController] Error getting status:', err);
    res.status(500).json({ error: 'Failed to get conversation status' });
  }
}

export async function resetDemoConversation(req: Request, res: Response): Promise<void> {
  try {
    const result = resetConversation();
    res.status(200).json({ 
      status: 'Conversation reset', 
      conversation: result 
    });
  } catch (err) {
    console.error('[DemoController] Error resetting conversation:', err);
    res.status(500).json({ error: 'Failed to reset conversation' });
  }
} 