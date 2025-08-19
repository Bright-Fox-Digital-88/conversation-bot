import { clearAllConversations } from '@services/conversation/conversationsStore';
import { cancelAllTimers } from '@services/conversation/timers';

export function scheduleDailyClear() {
  const scheduleNext = () => {
    const now = new Date();
    const next = new Date(now);
    next.setDate(now.getDate() + 1);
    next.setHours(0, 0, 0, 0);
    setTimeout(run, next.getTime() - now.getTime());
  };
  const run = () => {
    cancelAllTimers();
    clearAllConversations();
    scheduleNext();
  };
  scheduleNext();
}
