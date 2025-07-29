import { sendText, quickSend, sendLeadNotification } from '../../functions/twilio/send-text';

// Test configuration
const TEST_RECIPIENT = '+13134520306';
const TEST_MESSAGES = {
  basic: 'Hello! This is a test message from your CRM system.',
  leadNotification: 'Your loan application has been received and is being processed. We will contact you within 24 hours.',
  quick: 'Quick test message via quickSend function.'
};

async function runTwilioTests() {
  console.log('🚀 Starting Twilio SMS Tests...\n');

  // Test 1: Basic sendText function
  console.log('📱 Test 1: Basic sendText function');
  console.log(`Sending to: ${TEST_RECIPIENT}`);
  console.log(`Message: "${TEST_MESSAGES.basic}"`);
  
  try {
    const result = await sendText(TEST_RECIPIENT, TEST_MESSAGES.basic);
    
    if (result.success) {
      console.log('✅ SUCCESS!');
      console.log(`   Message SID: ${result.data?.sid}`);
      console.log(`   Status: ${result.data?.status}`);
      console.log(`   From: ${result.data?.from}`);
      console.log(`   To: ${result.data?.to}`);
      console.log(`   Segments: ${result.data?.numSegments}`);
    } else {
      console.log('❌ FAILED!');
      console.log(`   Error Code: ${result.error?.code}`);
      console.log(`   Error Message: ${result.error?.message}`);
    }
  } catch (error) {
    console.log('💥 EXCEPTION:', error);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: quickSend function
  console.log('📱 Test 2: quickSend function (boolean response)');
  console.log(`Sending to: ${TEST_RECIPIENT}`);
  console.log(`Message: "${TEST_MESSAGES.quick}"`);
  
  try {
    const success = await quickSend(TEST_RECIPIENT, TEST_MESSAGES.quick);
    
    if (success) {
      console.log('✅ SUCCESS! Message sent successfully.');
    } else {
      console.log('❌ FAILED! Message could not be sent.');
    }
  } catch (error) {
    console.log('💥 EXCEPTION:', error);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: sendLeadNotification function
  console.log('📱 Test 3: sendLeadNotification function (CRM integration)');
  console.log(`Sending to: ${TEST_RECIPIENT}`);
  console.log(`Message: "${TEST_MESSAGES.leadNotification}"`);
  
  try {
    const result = await sendLeadNotification(TEST_RECIPIENT, TEST_MESSAGES.leadNotification);
    
    if (result.success) {
      console.log('✅ SUCCESS!');
      console.log(`   Message SID: ${result.data?.sid}`);
      console.log(`   Status: ${result.data?.status}`);
      console.log(`   Date Created: ${result.data?.dateCreated}`);
      console.log(`   Price: ${result.data?.price} ${result.data?.priceUnit}`);
    } else {
      console.log('❌ FAILED!');
      console.log(`   Error Code: ${result.error?.code}`);
      console.log(`   Error Message: ${result.error?.message}`);
    }
  } catch (error) {
    console.log('💥 EXCEPTION:', error);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 4: Error handling test (invalid phone number)
  console.log('📱 Test 4: Error handling test (invalid phone number)');
  const invalidNumber = 'invalid-phone';
  console.log(`Sending to: ${invalidNumber}`);
  console.log(`Message: "This should fail"`);
  
  try {
    const result = await sendText(invalidNumber, 'This should fail');
    
    if (result.success) {
      console.log('🤔 UNEXPECTED SUCCESS - This should have failed');
    } else {
      console.log('✅ EXPECTED FAILURE - Error handling works correctly');
      console.log(`   Error Code: ${result.error?.code}`);
      console.log(`   Error Message: ${result.error?.message}`);
    }
  } catch (error) {
    console.log('✅ EXPECTED EXCEPTION - Error handling works correctly');
    console.log('   Exception:', error);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 5: Empty message test
  console.log('📱 Test 5: Input validation test (empty message)');
  console.log(`Sending to: ${TEST_RECIPIENT}`);
  console.log(`Message: "" (empty)`);
  
  try {
    const result = await sendText(TEST_RECIPIENT, '');
    
    if (result.success) {
      console.log('🤔 UNEXPECTED SUCCESS - This should have failed');
    } else {
      console.log('✅ EXPECTED FAILURE - Input validation works correctly');
      console.log(`   Error Code: ${result.error?.code}`);
      console.log(`   Error Message: ${result.error?.message}`);
    }
  } catch (error) {
    console.log('💥 EXCEPTION:', error);
  }

  console.log('\n🏁 Twilio SMS Tests Complete!\n');
}

// Run the tests
runTwilioTests().catch(console.error);

// Export for potential use in other test files
export { runTwilioTests, TEST_RECIPIENT, TEST_MESSAGES };
