import { getSystemMessages } from '@repositories/conversation/conversation.repo';
import { sendText } from '@utilities/twilio';
import { getConversation, upsertConversation } from './conversationsStore';

const timers = new Map<string, NodeJS.Timeout>();
function makeToken() { return `t_${Math.random().toString(36).slice(2,10)}`; }

export function startTimerFor(senderPhone: string, targetNumber: string): string {
  const existing = getConversation(senderPhone)?.timerId;
  if (existing) cancelTimerFor(existing);

  const token = makeToken();
  const sys = getSystemMessages();
  let elapsed = 0;
  const t = setInterval(async () => {
    elapsed++;
    if (elapsed === 25) await sendText(targetNumber, sys['5min']);
    if (elapsed === 30) {
      await sendText(targetNumber, sys['reset']);
      cancelTimerFor(token);
    }
  }, 60_000);

  timers.set(token, t);
  upsertConversation(senderPhone, { timerId: token });
  return token;
}

export function cancelTimerFor(token: string) {
  const t = timers.get(token);
  if (t) clearInterval(t);
  timers.delete(token);
}

export function cancelAllTimers() {
  for (const t of timers.values()) clearInterval(t);
  timers.clear();
}
