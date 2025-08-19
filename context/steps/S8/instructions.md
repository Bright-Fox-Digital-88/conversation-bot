# S8: Daily Clear Scheduler

## Overview
Add midnight task: cancel all timers and wipe conversations.json.

## Instructions
- In-process midnight schedule; can be replaced by cron later.

## Checklist
- [x] Timers canceled at midnight
- [x] conversations.json wiped at midnight

## Validators
```json
[
  {
    "type": "typescript_import",
    "target": "src/server.ts",
    "symbol": "scheduleDailyClear"
  }
]
```

## Cease Work When
Observed at midnight or via forced run

## Fabrication Summary
```json
{
  "created": [
    "/Users/gordonligon/Desktop/dev/conversation-bot/src/scheduler/daily.ts"
  ],
  "prepended": [
    "/Users/gordonligon/Desktop/dev/conversation-bot/src/server.ts"
  ],
  "skippedNonText": []
}
```
