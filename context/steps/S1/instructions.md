# S1: Conversations Store (JSON-backed)

## Overview
Add read/write helpers for /src/repositories/conversation/data/conversations.json keyed by senderPhone. Active conversations only.

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

## Fabrication Summary
```json
{
  "created": [
    "/Users/gordonligon/Desktop/dev/conversation-bot/src/services/conversation/conversationsStore.ts"
  ],
  "prepended": [],
  "skippedNonText": []
}
```
