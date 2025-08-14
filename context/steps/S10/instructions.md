# S10: Legacy Script Flow: Deprecation Fence

## Overview
Document deprecation or isolate legacy conversationHandler/conversationRuntime for demo-only path. Prevent accidental use in Twilio webhook.

## Priority
```json
{
  "theming": 0.7,
  "necessity": 0.55,
  "complexity": 0.2,
  "iterative_operability": 0.55,
  "composite": 0.4875,
  "rationale": "Makes intent clear and avoids conflicting singletons."
}
```

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

## Payload Manifest

### Files (targets to create/prepend)
```json
[
  "src/services/conversation/conversationHandler.ts",
  "src/services/conversation/conversationRuntime.ts"
]
```
