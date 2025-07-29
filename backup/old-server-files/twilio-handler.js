const { handleTwilioMessage } = require('../../controllers/conversation.controller');

// Get message from command line arguments
const message = process.argv[2];

if (!message) {
  console.error('No message provided');
  process.exit(1);
}

try {
  console.log('[Twilio Handler] Processing message:', message);
  handleTwilioMessage(message);
  console.log('[Twilio Handler] Message processed successfully');
  process.exit(0);
} catch (error) {
  console.error('[Twilio Handler] Error processing message:', error);
  process.exit(1);
} 