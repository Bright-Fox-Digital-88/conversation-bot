# S5: Reset Utility

## Overview
Add resetConversationFor(senderPhone) to kill that phone's timer and remove it from conversations.json.

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

## Fabrication Summary
```json
{
  "created": [
    "/Users/gordonligon/Desktop/dev/conversation-bot/src/services/conversation/reset.ts"
  ],
  "prepended": [],
  "skippedNonText": []
}
```
