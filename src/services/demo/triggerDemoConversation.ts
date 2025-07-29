// triggerDemoConversation.ts
import { handleConversation } from '@services/conversation';

export function triggerDemoConversation() {
  handleConversation(true);
}
