import twilio from 'twilio';
import { config } from 'dotenv';
import { SMSMessageParams, TwilioConfig, TwilioServiceResponse, TwilioMessageResponse } from '@models/twilio/twilio.model';

// Load environment variables from custom.env
config({ path: '.env.local' });

// Initialize Twilio configuration from environment variables
const twilioConfig: TwilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID!,
  authToken: process.env.TWILIO_AUTH_TOKEN!,
  botNumber: process.env.BOT_NUMBER!
};

// Initialize Twilio client
const client = twilio(twilioConfig.accountSid, twilioConfig.authToken);

/**
 * Send SMS text message with minimal parameters
 * @param to - Recipient phone number (E.164 format recommended: +1234567890)
 * @param body - Message content (up to 1600 characters)
 * @returns Promise with success/error response
 */
export async function sendText(
  to: string, 
  body: string
): Promise<TwilioServiceResponse> {
  try {
    // Validate inputs
    if (!to || !body) {
      return {
        success: false,
        error: {
          code: 400,
          message: 'Missing required parameters: to and body are required',
          moreInfo: 'https://www.twilio.com/docs/api/errors',
          status: 400
        }
      };
    }

    // Prepare message parameters with status callback
    const messageParams: SMSMessageParams = {
      to,
      from: twilioConfig.botNumber,
      body,
      statusCallback: process.env.STATUS_CALLBACK_URL || 'https://lendex-demo-dev.up.railway.app/twilio/status'
    };

    console.log('[Twilio] Sending message with callback URL:', messageParams.statusCallback);

    // Send the message
    const message = await client.messages.create(messageParams);

    // Return success response
    return {
      success: true,
      data: {
        sid: message.sid,
        accountSid: message.accountSid,
        from: message.from,
        to: message.to,
        body: message.body,
        status: message.status as any,
        direction: message.direction as any,
        apiVersion: message.apiVersion,
        price: message.price,
        priceUnit: message.priceUnit,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage,
        uri: message.uri,
        dateCreated: message.dateCreated.toISOString(),
        dateSent: message.dateSent?.toISOString() || null,
        dateUpdated: message.dateUpdated.toISOString(),
        messagingServiceSid: message.messagingServiceSid,
        numSegments: message.numSegments,
        numMedia: message.numMedia,
        subresourceUris: message.subresourceUris
      } as TwilioMessageResponse
    };

  } catch (error: any) {
    // Handle Twilio API errors
    return {
      success: false,
      error: {
        code: error.code || 500,
        message: error.message || 'Unknown error occurred',
        moreInfo: error.moreInfo || 'https://www.twilio.com/docs/api/errors',
        status: error.status || 500,
        details: error.details || {}
      }
    };
  }
}

/**
 * Quick send function - even simpler interface for common use cases
 * @param phoneNumber - Recipient phone number
 * @param message - Message to send
 * @returns Promise<boolean> - true if sent successfully, false otherwise
 */
export async function quickSend(phoneNumber: string, message: string): Promise<boolean> {
  const result = await sendText(phoneNumber, message);
  return result.success;
}

/**
 * Send notification to a lead from your CRM system
 * @param leadPhoneNumber - Lead's phone number
 * @param notificationMessage - Notification message
 * @returns Promise with detailed response
 */
export async function sendLeadNotification(
  leadPhoneNumber: string, 
  notificationMessage: string
): Promise<TwilioServiceResponse> {
  return sendText(leadPhoneNumber, notificationMessage);
}
