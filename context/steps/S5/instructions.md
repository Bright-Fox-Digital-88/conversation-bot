# S5: Reset Utility

## Overview
Add resetConversationFor(senderPhone) to kill that phone's timer and remove it from conversations.json.

## Priority
```json
{
  "theming": 0.8,
  "necessity": 0.9,
  "complexity": 0.15,
  "iterative_operability": 0.85,
  "composite": 0.8,
  "rationale": "A simple, testable primitive used by controller branches."
}
```

## Instructions
- Ensure timers are canceled before deleting the entry.

## Checklist
- [ ] Reset removes entry and no timer remains

## Validators
```json
[
  {
    "type": "typescript_function",
    "target": "src/services/conversation/reset.ts",
    "symbol": "resetConversationFor"
  }
]
```

## Cease Work When
Manual reset leaves no active timer

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
  "src/services/conversation/reset.ts"
]
```
