# S7: Controller Wiring: Demo Endpoint

## Overview
Allow /api/demo/ to accept targetNumber in body and forward to aiMessageNew on RESET+INIT, preserving your demo semantics.

## Priority
```json
{
  "theming": 0.75,
  "necessity": 0.7,
  "complexity": 0.25,
  "iterative_operability": 0.7,
  "composite": 0.6,
  "rationale": "Keeps demo-path parity while moving to AI-backed flow."
}
```

## Instructions
- Ensure demo controller mirrors new-init behavior with targetNumber required.

## Checklist
- [ ] RESET+INIT path initializes via aiMessageNew
- [ ] Errors on missing targetNumber or From

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

## Payload Manifest

### Files (targets to create/prepend)
```json
[
  "src/controllers/demo.controller.ts"
]
```
