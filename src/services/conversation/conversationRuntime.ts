// FABRICATOR PREPEND — DO NOT REMOVE
// Timestamp: 2025-08-18T10:59:32Z
// Spec Version: 1.0
// Target File: /Users/gordonligon/Desktop/dev/conversation-bot/src/services/conversation/conversationRuntime.ts
//
// ------------------------------------------------------------------------
//
// STUB PAYLOAD (commented copy follows)
//
// // DEPRECATION NOTE: Replaced by per-phone timers in src/services/conversation/timers.ts.
// // Avoid usage in new webhook paths.
//
// NOTE: Existing file detected. The fabricator header and commented stub were prepended above.
// Original content begins below.
//
import { ConversationState, SystemMessage } from '@models/conversation/conversation.model';
import { getSystemMessages } from '@repositories/conversation/conversation.repo';
import { sendText } from '@utilities/twilio';
import { config } from 'dotenv';
config({ path: '.env.local' });

// Load target phone number from .env
const TARGET_NUMBER = process.env.TARGET_NUMBER!;
if (!TARGET_NUMBER) {
  throw new Error('TARGET_NUMBER is not defined in custom.env');
}

const state: ConversationState = {
  i: 0,
  timer: null,
  elapsedMinutes: 0,
};

export function getIndex() {
  return state.i;
}

export function setIndex(value: number) {
  state.i = value;
}

export function incrementIndex() {
  state.i += 1;
}

export function stopTimer() {
  if (state.timer) {
    clearInterval(state.timer);
    state.timer = null;
  }
}

export function startTimer() {
  stopTimer(); // Safety reset
  state.elapsedMinutes = 0;
  const systemMessages: SystemMessage = getSystemMessages();

  state.timer = setInterval(() => {
    state.elapsedMinutes++;

    if (state.elapsedMinutes === 25) {
      sendText(TARGET_NUMBER, systemMessages["5min"]);
    }

    if (state.elapsedMinutes === 30) {
      sendText(TARGET_NUMBER, systemMessages["reset"]);
      setIndex(0);
      stopTimer();
    }
  }, 60 * 1000); // Every minute
}

// Export a function to check if timer is active
export function isTimerActive(): boolean {
  return state.timer !== null;
}
