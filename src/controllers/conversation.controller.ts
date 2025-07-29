import { handleConversation } from '@services/conversation';

export async function handleTwilioMessage(message: string): Promise<void> {
  const shouldReset = message.includes('RESET'); // Must be all caps
  await handleConversation(shouldReset);
}
