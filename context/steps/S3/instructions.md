# S3: OpenAI Chat Wrapper

## Overview
Simple wrapper around the OpenAI Chat Completions API. All tunables come from JSON prompt config; API key from environment.

## Priority
```json
{
  "theming": 0.85,
  "necessity": 0.95,
  "complexity": 0.25,
  "iterative_operability": 0.85,
  "composite": 0.875,
  "rationale": "Unblocks AI message funcs; isolated surface simplifies testing."
}
```

## Instructions
- Use env var OPENAI_API_KEY.
- No retries/backoff in this stub; keep minimal.

## Checklist
- [ ] Function returns assistant content string or empty string
- [ ] Does not hardcode model/params

## Validators
```json
[
  {
    "type": "typescript_function",
    "target": "src/services/openai/chat.ts",
    "symbol": "generateChatCompletion"
  }
]
```

## Cease Work When
A test call returns text

## Payload Manifest

### Layout (directories to create)
```json
[
  "src/services/openai"
]
```

### Files (targets to create/prepend)
```json
[
  "src/services/openai/chat.ts"
]
```
