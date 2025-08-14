# S4: AI Message Functions

## Overview
Add aiMessageNew (bootstrap/init) and aiMessage (turn-taking) to operate on conversations.json and Twilio SMS.

## Priority
```json
{
  "theming": 0.9,
  "necessity": 1,
  "complexity": 0.45,
  "iterative_operability": 0.9,
  "composite": 0.9125,
  "rationale": "Core flow that turns inputs into replies and persists turns."
}
```

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
  "src/services/conversation/ai.ts"
]
```
