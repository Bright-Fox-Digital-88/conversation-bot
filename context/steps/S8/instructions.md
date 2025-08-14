# S8: Daily Clear Scheduler

## Overview
Add midnight task: cancel all timers and wipe conversations.json.

## Priority
```json
{
  "theming": 0.8,
  "necessity": 0.75,
  "complexity": 0.2,
  "iterative_operability": 0.7,
  "composite": 0.6625,
  "rationale": "Keeps store clean. Simple in-process scheduler."
}
```

## Instructions
- In-process midnight schedule; can be replaced by cron later.

## Checklist
- [ ] Timers canceled at midnight
- [ ] conversations.json wiped at midnight

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

## Payload Manifest

### Layout (directories to create)
```json
[
  "src/scheduler"
]
```

### Files (targets to create/prepend)
```json
[
  "src/scheduler/daily.ts",
  "src/server.ts"
]
```
