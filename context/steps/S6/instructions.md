# S6: Controller Wiring: Twilio Webhook

## Overview
Modify handleConversationMessage to use senderPhone from Twilio's From. Support branches: Reset+Init, Reset, Init, Normal. Normal calls aiMessage; Init flows call aiMessageNew and start per-phone timer. Accept optional promptId and targetNumber in body (targetNumber required for new/init paths).

## Instructions
- Extract senderPhone from req.body.From.
- Require targetNumber for init/new flows.

## Checklist
- [ ] All four branches reachable
- [ ] Normal flow works without targetNumber
- [ ] New/init flows require targetNumber and succeed

## Validators
```json
[
  {
    "type": "typescript_function",
    "target": "src/controllers/conversation.controller.ts",
    "symbol": "handleConversationMessage"
  }
]
```

## Cease Work When
Webhook tests pass

## Fabrication Summary
```json
{
  "created": [],
  "prepended": [
    "/Users/gordonligon/Desktop/dev/conversation-bot/src/controllers/conversation.controller.ts"
  ],
  "skippedNonText": []
}
```
