import { sendText } from './src/utilities/twilio';
import { config } from 'dotenv';

// Load environment variables
config({ path: 'custom.env' });

const TARGET_NUMBER = process.env.TARGET_NUMBER!;
const BOT_NUMBER = process.env.BOT_NUMBER!;

if (!TARGET_NUMBER || !BOT_NUMBER) {
  console.error('Missing required environment variables: TARGET_NUMBER or BOT_NUMBER');
  process.exit(1);
}

async function testTwilioDelivery() {
  console.log('=== Twilio Delivery Debug Test ===');
  console.log(`Target Number: ${TARGET_NUMBER}`);
  console.log(`Bot Number: ${BOT_NUMBER}`);
  
  const testMessage = "Test message for delivery debugging - " + new Date().toISOString();
  
  try {
    console.log('\n📤 Sending test message...');
    const response = await sendText(TARGET_NUMBER, testMessage);
    
    if (response.success) {
      console.log('✅ Message sent successfully!');
      console.log('📊 Message Details:', {
        SID: response.data?.sid,
        Status: response.data?.status,
        To: response.data?.to,
        From: response.data?.from,
        Body: response.data?.body,
        DateCreated: response.data?.dateCreated,
        Price: response.data?.price,
        PriceUnit: response.data?.priceUnit
      });
      
      // Simulate status callback for debugging
      console.log('\n🔄 Simulating status callback...');
      await simulateStatusCallback(response.data?.sid || 'unknown_sid');
      
    } else {
      console.error('❌ Message failed to send!');
      console.error('Error Details:', {
        Code: response.error?.code,
        Message: response.error?.message,
        Status: response.error?.status,
        MoreInfo: response.error?.moreInfo
      });
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

async function simulateStatusCallback(messageSid: string) {
  // Common Twilio status values
  const statuses = [
    'queued',
    'sending', 
    'sent',
    'delivered',
    'undelivered',
    'failed'
  ];
  
  console.log(`📞 Simulating status updates for message SID: ${messageSid}`);
  
  for (const status of statuses) {
    console.log(`\n🔄 Status: ${status.toUpperCase()}`);
    
    // Simulate the callback payload that Twilio would send
    const callbackPayload = {
      MessageSid: messageSid,
      MessageStatus: status,
      To: TARGET_NUMBER,
      From: BOT_NUMBER,
      ErrorCode: status === 'undelivered' ? '30007' : null, // Invalid phone number
      ErrorMessage: status === 'undelivered' ? 'Invalid phone number' : null,
      Timestamp: new Date().toISOString()
    };
    
    console.log('📋 Callback Payload:', callbackPayload);
    
    // If you have a callback URL, you could POST to it here
    // await fetch('your-callback-url', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   body: new URLSearchParams(callbackPayload)
    // });
    
    // Add delay to simulate real-time updates
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✅ Status callback simulation complete!');
}

// Run the test
testTwilioDelivery().catch(console.error); 