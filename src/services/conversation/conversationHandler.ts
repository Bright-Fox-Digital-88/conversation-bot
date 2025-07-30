import { getConversationScript } from '@repositories/conversation/conversation.repo';
import { sendText } from '@utilities/twilio';
import { stateManager } from './stateManager';
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
    
    // Check for reset command
    const shouldReset = message.toLowerCase().includes('reset');
    
    if (shouldReset) {
      console.log('[ConversationHandler] Reset command detected, resetting state');
      stateManager.resetState();
      return {
        success: true,
        message: 'Conversation state reset',
        currentIndex: 0,
        totalMessages: convoReply.length
      };
    }

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