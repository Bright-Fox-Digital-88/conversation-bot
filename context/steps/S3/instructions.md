# S3: OpenAI Chat Wrapper

## Overview
Simple wrapper around the OpenAI Chat Completions API. All tunables come from JSON prompt config; API key from environment.

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

## Fabrication Summary
```json
{
  "created": [
    "/Users/gordonligon/Desktop/dev/conversation-bot/src/services/openai/chat.ts"
  ],
  "prepended": [],
  "skippedNonText": []
}
```
