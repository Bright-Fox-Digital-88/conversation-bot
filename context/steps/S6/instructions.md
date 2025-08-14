# S6: Controller Wiring: Twilio Webhook

## Overview
Modify handleConversationMessage to use senderPhone from Twilio's From. Support branches: Reset+Init, Reset, Init, Normal. Normal calls aiMessage; Init flows call aiMessageNew and start per-phone timer. Accept optional promptId and targetNumber in body (targetNumber required for new/init paths).

## Priority
```json
{
  "theming": 0.95,
  "necessity": 1,
  "complexity": 0.5,
  "iterative_operability": 0.95,
  "composite": 0.925,
  "rationale": "Primary integration point that turns HTTP/Twilio into conversation actions."
}
```

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

## Payload Manifest

### Files (targets to create/prepend)
```json
[
  "src/controllers/conversation.controller.ts"
]
```
