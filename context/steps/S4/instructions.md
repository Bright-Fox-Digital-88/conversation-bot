# S4: AI Message Functions

## Overview
Add aiMessageNew (bootstrap/init) and aiMessage (turn-taking) to operate on conversations.json and Twilio SMS.

## Instructions
- Bootstrap with system + init_user then append assistant and persist.
- Normal flow appends user, calls OpenAI, appends assistant, persists.

## Checklist
- [ ] aiMessageNew persists a conversation and starts a timer
- [ ] aiMessage reads, appends, generates, and persists

## Validators
```json
[
  {
    "type": "typescript_function",
    "target": "src/services/conversation/ai.ts",
    "symbol": "aiMessageNew"
  },
  {
    "type": "typescript_function",
    "target": "src/services/conversation/ai.ts",
    "symbol": "aiMessage"
  }
]
```

## Cease Work When
Manual SMS roundtrip works locally

## Fabrication Summary
```json
{
  "created": [
    "/Users/gordonligon/Desktop/dev/conversation-bot/src/services/conversation/ai.ts"
  ],
  "prepended": [],
  "skippedNonText": []
}
```
