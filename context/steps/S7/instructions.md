# S7: Controller Wiring: Demo Endpoint

## Overview
Allow /api/demo/ to accept targetNumber in body and forward to aiMessageNew on RESET+INIT, preserving your demo semantics.

## Instructions
- Ensure demo controller mirrors new-init behavior with targetNumber required.

## Checklist
- [x] RESET+INIT path initializes via aiMessageNew
- [x] Errors on missing targetNumber or From

## Validators
```json
[
  {
    "type": "typescript_function",
    "target": "src/controllers/demo.controller.ts",
    "symbol": "handleDemoMessage"
  }
]
```

## Cease Work When
Demo roundtrip works

## Fabrication Summary
```json
{
  "created": [],
  "prepended": [
    "/Users/gordonligon/Desktop/dev/conversation-bot/src/controllers/demo.controller.ts"
  ],
  "skippedNonText": []
}
```
