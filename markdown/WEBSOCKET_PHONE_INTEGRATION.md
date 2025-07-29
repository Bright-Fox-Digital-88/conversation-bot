# WebSocket Phone Number Integration Guide

## Overview

The WebSocket server now supports passing phone numbers to step commands for SMS functionality. This allows the frontend to dynamically specify which phone number should receive SMS messages during step execution.

## Message Format

### Step Command with Phone Number

When sending a step command that requires SMS functionality, include a `phone` field in your WebSocket message:

```javascript
// Send step 8 with phone number
ws.send(JSON.stringify({
  type: 'step',
  stepNumber: 8,
  phone: '+15551234567'
}));
```

### Step Command without Phone Number

For steps that don't require SMS functionality, omit the `phone` field:

```javascript
// Send step 5 without phone number
ws.send(JSON.stringify({
  type: 'step',
  stepNumber: 5
}));
```

## Phone Number Validation

- **Format**: Phone numbers should be in E.164 format (e.g., `+15551234567`)
- **Empty/Null Handling**: If `phone` is empty, null, or undefined, the step will execute without SMS functionality
- **Whitespace**: Leading/trailing whitespace is automatically trimmed

## Priority Logic

The phone number passed via WebSocket has **lower priority** than the `target_number` specified in the step's JSON configuration:

1. **Primary**: `message.target_number` from step JSON (e.g., `carl-contact.json`)
2. **Fallback**: `phone` field from WebSocket message
3. **No SMS**: If neither exists, no SMS is sent

## Example Frontend Implementation

```javascript
const handleStepWithPhone = (stepNumber, phoneNumber) => {
  const message = {
    type: 'step',
    stepNumber: stepNumber
  };
  
  // Only add phone if provided
  if (phoneNumber && phoneNumber.trim()) {
    message.phone = phoneNumber.trim();
  }
  
  ws.send(JSON.stringify(message));
};

// Usage examples
handleStepWithPhone(8, '+15551234567');  // With phone
handleStepWithPhone(5);                   // Without phone
```

## Backend Processing

The WebSocket server will:

1. Extract the `phone` field from the incoming message
2. Format it as JSON: `{"phone": "+15551234567"}`
3. Pass it as the 3rd argument to `app.js`
4. Execute the step with SMS functionality if phone is provided

## Error Handling

- **Invalid Phone Format**: The backend will attempt to send SMS but may fail if format is incorrect
- **Missing Phone**: Step executes normally without SMS functionality
- **Network Errors**: SMS failures are logged but don't stop step execution

## Testing

You can test phone number integration by:

1. Sending a step command with a valid phone number
2. Checking the backend logs for SMS confirmation
3. Verifying the phone number used (JSON priority vs WebSocket fallback) 