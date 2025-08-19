import { getConversation, deleteConversation } from './conversationsStore';
import { cancelTimerFor } from './timers';

export function resetConversationFor(senderPhone: string) {
  const convo = getConversation(senderPhone);
  if (convo?.timerId) cancelTimerFor(convo.timerId);
  deleteConversation(senderPhone);
}
