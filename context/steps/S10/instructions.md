# S10: Legacy Script Flow: Deprecation Fence

## Overview
Document deprecation or isolate legacy conversationHandler/conversationRuntime for demo-only path. Prevent accidental use in Twilio webhook.

## Instructions
- Prepend deprecation banners.
- Ensure current controllers do not import these in the Twilio webhook path.

## Checklist
- [ ] Deprecated files contain banner comments
- [ ] Webhook controller imports only new AI modules

## Validators
```json
[
  {
    "type": "grep_absence",
    "target": "src/controllers/conversation.controller.ts",
    "symbol": "handleConversationWithReset",
    "path": "src/controllers/conversation.controller.ts",
    "pattern": "handleConversationWithReset"
  }
]
```

## Cease Work When
No legacy imports in webhook controller

## Fabrication Summary
```json
{
  "created": [],
  "prepended": [
    "/Users/gordonligon/Desktop/dev/conversation-bot/src/services/conversation/conversationHandler.ts",
    "/Users/gordonligon/Desktop/dev/conversation-bot/src/services/conversation/conversationRuntime.ts"
  ],
  "skippedNonText": []
}
```
