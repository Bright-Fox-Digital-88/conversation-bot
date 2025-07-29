import { handleTwilioMessage } from '../../controllers/conversation.controller';

async function main() {
  // Get message from command line arguments
  const message = process.argv[2];

  if (!message) {
    console.error('No message provided');
    process.exit(1);
  }

  try {
    console.log('[Twilio Handler] Processing message:', message);
    console.log('[Twilio Handler] Calling handleTwilioMessage...');
    await handleTwilioMessage(message);
    console.log('[Twilio Handler] handleTwilioMessage completed successfully');
    console.log('[Twilio Handler] Message processed successfully');
    process.exit(0);
  } catch (error) {
    console.error('[Twilio Handler] Error processing message:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('[Twilio Handler] Fatal error:', error);
  process.exit(1);
}); 