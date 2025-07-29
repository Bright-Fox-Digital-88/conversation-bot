import { getConversationScript } from '@repositories/conversation/conversation.repo';
import { sendText } from '@utilities/twilio';
import {
  getIndex,
  setIndex,
  incrementIndex,
  startTimer,
  stopTimer,
} from './conversationRuntime';
import { config } from 'dotenv';

config({ path: 'custom.env' });

const TARGET_NUMBER = process.env.TARGET_NUMBER!;
if (!TARGET_NUMBER) {
  throw new Error('TARGET_NUMBER is not defined in custom.env');
}

const convoReply = getConversationScript();

export async function handleConversation(reset: boolean) {
  stopTimer(); // Always reset the timer before continuing

  if (reset) {
    setIndex(0);
  } else {
    incrementIndex();
  }

  const currentIndex = getIndex();

  if (currentIndex >= convoReply.length) {
    console.warn("No more replies to send.");
    return;
  }

  const messageToSend = convoReply[currentIndex];
  console.log(`[Conversation] Sending message ${currentIndex + 1}/${convoReply.length}: "${messageToSend}"`);
  
  const twilioResponse = await sendText(TARGET_NUMBER, messageToSend);
  
  if (twilioResponse.success) {
    console.log('[Conversation] ✅ Message sent successfully:', {
      sid: twilioResponse.data?.sid,
      status: twilioResponse.data?.status,
      to: twilioResponse.data?.to,
      dateCreated: twilioResponse.data?.dateCreated
    });
  } else {
    console.error('[Conversation] ❌ Message failed to send:', {
      errorCode: twilioResponse.error?.code,
      errorMessage: twilioResponse.error?.message,
      status: twilioResponse.error?.status,
      moreInfo: twilioResponse.error?.moreInfo
    });
  }

  startTimer();
}
