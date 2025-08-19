// FABRICATOR PREPEND — DO NOT REMOVE
// Timestamp: 2025-08-18T10:59:32Z
// Spec Version: 1.0
// Target File: /Users/gordonligon/Desktop/dev/conversation-bot/src/services/conversation/conversationHandler.ts
//
// ------------------------------------------------------------------------
//
// STUB PAYLOAD (commented copy follows)
//
// // DEPRECATION NOTE: This scripted flow was superseded by per-sender AI flows.
// // Keep only if needed for strictly scripted demos. Do not import in Twilio webhook controller.
//
// NOTE: Existing file detected. The fabricator header and commented stub were prepended above.
// Original content begins below.
//
import { getConversationScript } from '@repositories/conversation/conversation.repo';
import { sendText } from '@utilities/twilio';
import { stateManager } from './stateManager';
import { startTimer } from './conversationRuntime';
import { config } from 'dotenv';

config({ path: '.env.local' });

const TARGET_NUMBER = process.env.TARGET_NUMBER!;
if (!TARGET_NUMBER) {
  throw new Error('TARGET_NUMBER is not defined in .env');
}

const convoReply = getConversationScript();

export async function handleConversationMessage(message: string): Promise<{
  success: boolean;
  message?: string;
  currentIndex?: number;
  totalMessages?: number;
  error?: string;
}> {
  try {
    console.log('[ConversationHandler] Processing message:', message);
    
    // Get current state
    const currentIndex = stateManager.getCurrentIndex();
    console.log(`[ConversationHandler] Current index: ${currentIndex}/${convoReply.length}`);

    // Check if we've reached the end
    if (currentIndex >= convoReply.length) {
      console.warn('[ConversationHandler] No more replies to send');
      return {
        success: true,
        message: 'Conversation complete - no more messages to send',
        currentIndex,
        totalMessages: convoReply.length
      };
    }

    // Get the message to send
    const messageToSend = convoReply[currentIndex];
    console.log(`[ConversationHandler] Sending message ${currentIndex + 1}/${convoReply.length}: "${messageToSend}"`);
    
    // Send the message
    const twilioResponse = await sendText(TARGET_NUMBER, messageToSend);
    
    if (twilioResponse.success) {
      console.log('[ConversationHandler] ✅ Message sent successfully:', {
        sid: twilioResponse.data?.sid,
        status: twilioResponse.data?.status,
        to: twilioResponse.data?.to,
        dateCreated: twilioResponse.data?.dateCreated
      });
      
      // Increment the index for next time
      stateManager.incrementIndex();
      
      return {
        success: true,
        message: 'Message sent successfully',
        currentIndex: currentIndex + 1,
        totalMessages: convoReply.length
      };
    } else {
      console.error('[ConversationHandler] ❌ Message failed to send:', {
        errorCode: twilioResponse.error?.code,
        errorMessage: twilioResponse.error?.message,
        status: twilioResponse.error?.status,
        moreInfo: twilioResponse.error?.moreInfo
      });
      
      return {
        success: false,
        error: `Failed to send message: ${twilioResponse.error?.message || 'Unknown error'}`,
        currentIndex,
        totalMessages: convoReply.length
      };
    }
    
  } catch (error) {
    console.error('[ConversationHandler] Error processing conversation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function handleConversationWithReset(reset: boolean, init: boolean = false): Promise<{
  success: boolean;
  message?: string;
  currentIndex?: number;
  totalMessages?: number;
  error?: string;
}> {
  try {
    console.log('[ConversationHandler] Processing with reset/init:', { reset, init });
    
    // Handle reset
    if (reset) {
      console.log('[ConversationHandler] Resetting conversation state');
      stateManager.resetState();
    }
    
    // Handle init - send first message and start timer
    if (init) {
      console.log('[ConversationHandler] Initializing conversation');
      const firstMessage = convoReply[0];
      console.log(`[ConversationHandler] Sending first message: "${firstMessage}"`);
      
      const twilioResponse = await sendText(TARGET_NUMBER, firstMessage);
      
      if (twilioResponse.success) {
        console.log('[ConversationHandler] ✅ First message sent successfully');
        stateManager.incrementIndex();
        startTimer();
        
        return {
          success: true,
          message: 'Conversation initialized with first message',
          currentIndex: 1,
          totalMessages: convoReply.length
        };
      } else {
        console.error('[ConversationHandler] ❌ First message failed to send');
        return {
          success: false,
          error: `Failed to send first message: ${twilioResponse.error?.message || 'Unknown error'}`,
          currentIndex: 0,
          totalMessages: convoReply.length
        };
      }
    }
    
    // If reset=true and init=false, just return success without sending message
    if (reset && !init) {
      console.log('[ConversationHandler] Reset only - no message sent');
      return {
        success: true,
        message: 'Conversation state reset',
        currentIndex: 0,
        totalMessages: convoReply.length
      };
    }
    
    // Normal conversation flow (only if reset=false and init=false)
    return await handleConversationMessage('');
    
  } catch (error) {
    console.error('[ConversationHandler] Error processing conversation with reset/init:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export function getConversationStatus() {
  return {
    currentIndex: stateManager.getCurrentIndex(),
    totalMessages: convoReply.length,
    messageCount: stateManager.getMessageCount(),
    lastMessageTime: stateManager.getLastMessageTime(),
    isActive: stateManager.isActive()
  };
}

export function resetConversation() {
  stateManager.resetState();
  return {
    success: true,
    message: 'Conversation reset successfully',
    currentIndex: 0,
    totalMessages: convoReply.length
  };
} 