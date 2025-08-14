# S1: Conversations Store (JSON-backed)

## Overview
Add read/write helpers for /src/repositories/conversation/data/conversations.json keyed by senderPhone. Active conversations only.

## Priority
```json
{
  "theming": 0.9,
  "necessity": 1,
  "complexity": 0.3,
  "iterative_operability": 0.85,
  "composite": 0.88,
  "rationale": "Needed for per-sender state before timers/AI can function."
}
```

## Instructions
- Persist and retrieve active conversations keyed by senderPhone.
- No timers are stored here beyond a public token (string).

## Checklist
- [ ] Upsert inserts/merges correctly
- [ ] Delete removes a key
- [ ] clearAllConversations empties the file and returns prior phone list

## Validators
```json
[
  {
    "type": "typescript_function",
    "target": "src/services/conversation/conversationsStore.ts",
    "symbol": "getConversation"
  },
  {
    "type": "typescript_function",
    "target": "src/services/conversation/conversationsStore.ts",
    "symbol": "upsertConversation"
  }
]
```

## Cease Work When
CRUD works locally

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
  "src/services/conversation/conversationsStore.ts"
]
```
