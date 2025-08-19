# S2: Per-Phone Timers

## Overview
Introduce in-memory timers keyed by a public token stored on the conversation entry. Sends 5min/reset system messages and cancels on timeout.

## Instructions
- One timer per conversation via token; actual Timeout is not serialized.
- 5min reminder at 25, reset message at 30, then cancel.

## Checklist
- [ ] Starting a timer returns a token and persists it
- [ ] cancelTimerFor stops an active timer
- [ ] cancelAllTimers clears the map

## Validators
```json
[
  {
    "type": "typescript_function",
    "target": "src/services/conversation/timers.ts",
    "symbol": "startTimerFor"
  }
]
```

## Cease Work When
Manual test shows reminders firing as expected

## Fabrication Summary
```json
{
  "created": [
    "/Users/gordonligon/Desktop/dev/conversation-bot/src/services/conversation/timers.ts"
  ],
  "prepended": [],
  "skippedNonText": []
}
```
