# S2: Per-Phone Timers

## Overview
Introduce in-memory timers keyed by a public token stored on the conversation entry. Sends 5min/reset system messages and cancels on timeout.

## Priority
```json
{
  "theming": 0.85,
  "necessity": 0.9,
  "complexity": 0.35,
  "iterative_operability": 0.8,
  "composite": 0.83,
  "rationale": "Timers are required for auto-reset and notification flow."
}
```

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

## Payload Manifest

### Layout (directories to create)
```json
[
  "src/services/conversation"
]
```

### Files (targets to create/prepend)
```json
[
  "src/services/conversation/timers.ts"
]
```
