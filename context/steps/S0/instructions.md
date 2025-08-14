# S0: Contracts & Prompt Loader

## Overview
Introduce per-sender conversation contracts and a prompt repo that must load default.json (or promptId) from /src/repositories/prompts/data. If default.json is missing, throw with console help. Aligns the codebase for AI-first flow.

## Instructions
- Create session.model.ts with PromptConfig, ChatMessage, MessagePayload, and ConversationEntry interfaces.
- Implement loadPromptConfig with fallback to default.json and console guidance if missing.

## Checklist
- [ ] session.model.ts exists with correct interfaces
- [ ] prompt.repo.ts loads configs and falls back to default.json
- [ ] Throws error with guidance if default.json missing

## Validators
```json
[
  {
    "type": "typescript_import",
    "target": "src/repositories/prompts/prompt.repo.ts",
    "symbol": "PromptConfig"
  },
  {
    "type": "typescript_interface",
    "target": "src/models/conversation/session.model.ts",
    "symbol": "ConversationEntry"
  }
]
```

## Cease Work When
Checklist passes

## Fabrication Summary
```json
{
  "created": [
    "/Users/gordonligon/Desktop/dev/conversation-bot/src/models/conversation/session.model.ts",
    "/Users/gordonligon/Desktop/dev/conversation-bot/src/repositories/prompts/prompt.repo.ts"
  ],
  "prepended": [],
  "skippedNonText": []
}
```
