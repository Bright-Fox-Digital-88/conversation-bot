# Conversation Bot

A powerful AI-powered conversation bot application with Twilio integration and HTTP support. This system enables intelligent SMS conversations using GPT-4, with support for conversation management, reset/init flows, and demo endpoints.

## 🚀 Features

- **AI-Powered Conversations**: Uses OpenAI GPT-4 for intelligent responses
- **Twilio Integration**: Full SMS support with webhook handling
- **Conversation Management**: Per-phone conversation state with context preservation
- **Reset/Init Flows**: Easy conversation reset and initialization
- **Demo Endpoints**: Simplified testing and demo capabilities
- **Status Callbacks**: Twilio delivery status tracking
- **Timer Management**: Automatic conversation cleanup

## 📋 Prerequisites

- Node.js >= 20.0.0
- OpenAI API Key
- Twilio Account (for SMS functionality)
- Environment variables configured

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd conversation-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file with:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   BOT_NUMBER=your_twilio_phone_number
   STATUS_CALLBACK_URL=https://your-domain.com/api/conversation/twilio/status
   ```

4. **Start the server**
   ```bash
   npm start
   ```

## 🌐 API Endpoints

### Base URL: `http://localhost:3000/api`

### 1. Main Conversation Endpoint
**POST** `/api/conversation/`

Handles Twilio webhook messages and manages AI conversations.

**Required Parameters:**
- `From` (string) - The sender's phone number (Twilio format)
- `Body` (string) - The message content

**Optional Parameters:**
- `targetNumber` (string) - Where bot should send responses (defaults to From if not provided)
- `promptId` (string) - Used for initialization flows

**Flow Logic:**
- **Reset + Init Flow**: Message contains both "reset" and "init"
- **Reset Flow**: Message contains "reset" (clears conversation, no response)
- **Init Flow**: Message contains "init" (starts new conversation)
- **Normal Flow**: Standard conversation continuation

### 2. Demo Endpoint
**POST** `/api/demo/`

Simplified endpoint for testing and demo scenarios.

**Required Parameters:**
- `message` (string) - Must contain both "RESET" and "INIT" (all caps)
- `targetNumber` (string) - Phone number (serves as both sender and recipient)

**Optional Parameters:**
- `promptId` (string) - Custom prompt configuration

### 3. Demo Status Endpoint
**GET** `/api/demo/status`

Returns conversation status for demo mode.

### 4. Twilio Status Callback
**POST** `/api/conversation/twilio/status`

Handles Twilio delivery status updates.

**Parameters:**
- `MessageSid` - Twilio message identifier
- `MessageStatus` - Status (delivered, undelivered, failed, sent, queued)
- `To` - Recipient phone number
- `From` - Sender phone number
- `ErrorCode` - Error code if failed
- `ErrorMessage` - Error description if failed

## 📝 Example Requests

### Conversation Endpoint (Twilio Webhook)
```json
{
  "From": "+1234567890",
  "Body": "init",
  "promptId": "some-prompt-id"
}
```

### Demo Endpoint
```json
{
  "message": "RESET INIT",
  "targetNumber": "+1234567890",
  "promptId": "some-prompt-id"
}
```

## 🔧 Configuration

### Prompt Configuration
Prompts are stored in `src/repositories/prompts/data/`:
- `default.json` - Default prompt configuration
- `{promptId}.json` - Custom prompt configurations

**Prompt Structure:**
```json
{
  "model": "gpt-4",
  "api_params": {
    "temperature": 0.7,
    "max_tokens": 256,
    "top_p": 1,
    "presence_penalty": 0,
    "frequency_penalty": 0
  },
  "system": "You are a helpful AI assistant...",
  "init_user": "INIT"
}
```

### Conversation Storage
Conversations are stored in `src/repositories/conversation/data/conversations.json` with:
- Per-phone conversation history
- Message context for AI continuity
- Timer management
- Target number tracking

## 🏃‍♂️ Running the Application

### Development
```bash
npm start
# or
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 📊 Server Configuration

- **Default Port**: 3000
- **Environment**: development/production
- **Request Logging**: ENABLED
- **CORS**: ENABLED
- **Morgan Logging**: development only

## 🔍 Testing

### Test Conversation Flow
1. **Initialize**: Send "INIT" to start conversation
2. **Normal Chat**: Send regular messages for AI responses
3. **Reset**: Send "RESET" to clear conversation
4. **Reset + Init**: Send "RESET INIT" to restart

### Test Demo Flow
```bash
curl -X POST http://localhost:3000/api/demo/ \
  -H "Content-Type: application/json" \
  -d '{"message": "RESET INIT", "targetNumber": "+1234567890"}'
```

## 🏗️ Architecture

### Core Components
- **Controllers**: Handle HTTP requests and Twilio webhooks
- **Services**: AI conversation logic and Twilio integration
- **Repositories**: Data storage and prompt management
- **Models**: TypeScript interfaces and data structures
- **Utilities**: Helper functions and Twilio utilities

### Key Services
- `ai.ts` - OpenAI integration and conversation management
- `conversationsStore.ts` - Conversation state management
- `timers.ts` - Conversation cleanup timers
- `reset.ts` - Conversation reset functionality
- `twilio.ts` - SMS sending and webhook handling

## 🔒 Security Considerations

- Store API keys in environment variables
- Use HTTPS in production
- Validate all incoming webhook data
- Implement rate limiting for production use
- Monitor conversation storage for sensitive data

## 🐛 Troubleshooting

### Common Issues
1. **OpenAI API Key Missing**: Ensure `OPENAI_API_KEY` is set in `.env.local`
2. **Twilio Configuration**: Verify `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `BOT_NUMBER`
3. **Port Conflicts**: Change port in environment or kill existing processes
4. **Path Alias Issues**: Ensure `tsconfig-paths-bootstrap.js` is properly configured

### Logs
The application provides detailed logging:
- Request/response logging
- Twilio webhook processing
- AI conversation flow
- Error handling and debugging

## 📈 Monitoring

- Monitor conversation storage size
- Track Twilio delivery status
- Monitor OpenAI API usage
- Check timer cleanup effectiveness

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

[Add your license information here]

---

**Note**: This system is designed for AI-powered SMS conversations. Ensure compliance with local regulations regarding automated messaging and data privacy.
