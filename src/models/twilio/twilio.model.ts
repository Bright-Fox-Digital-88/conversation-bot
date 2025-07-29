// Twilio SMS Configuration Types
export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  botNumber: string;
}

// SMS Message Parameters - Required fields for sending SMS
export interface SMSMessageParams {
  to: string;           // Recipient phone number (E.164 format recommended: +1234567890)
  from: string;         // Sender phone number (your BOT_NUMBER)
  body: string;         // Message content (up to 1600 characters)
  statusCallback?: string; // Webhook URL for delivery status updates
}

// Optional SMS Parameters for enhanced functionality
export interface SMSMessageOptions extends SMSMessageParams {
  mediaUrl?: string[];  // Array of media URLs for MMS
  statusCallback?: string; // Webhook URL for delivery status updates
  maxPrice?: string;    // Maximum price willing to pay for message
  provideFeedback?: boolean; // Request delivery feedback
  attemptWhitelistRemoval?: boolean; // Attempt to remove from carrier whitelist
  validityPeriod?: number; // Message validity period in seconds (max 14400 = 4 hours)
  forceDelivery?: boolean; // Force delivery even if recipient opted out
  smartEncoded?: boolean; // Enable smart encoding for international messages
  persistentAction?: string[]; // Actions to persist across message lifecycle
}

// Twilio API Response Types
export interface TwilioMessageResponse {
  sid: string;          // Unique message identifier
  accountSid: string;   // Account SID that created the message
  from: string;         // Sender phone number
  to: string;           // Recipient phone number  
  body: string;         // Message content
  status: TwilioMessageStatus; // Current message status
  direction: 'inbound' | 'outbound-api' | 'outbound-call' | 'outbound-reply';
  apiVersion: string;   // Twilio API version used
  price: string | null; // Cost of the message
  priceUnit: string;    // Currency of the price
  errorCode: number | null; // Error code if message failed
  errorMessage: string | null; // Error description if message failed
  uri: string;          // URI of the message resource
  dateCreated: string;  // ISO 8601 timestamp when message was created
  dateSent: string | null; // ISO 8601 timestamp when message was sent
  dateUpdated: string;  // ISO 8601 timestamp when message was last updated
  messagingServiceSid: string | null; // Messaging service SID if used
  numSegments: string;  // Number of segments the message was split into
  numMedia: string;     // Number of media files attached
  subresourceUris: {    // URIs for related resources
    media: string;
    feedback: string;
  };
}

// Twilio Message Status Enum
export type TwilioMessageStatus = 
  | 'accepted'      // Message accepted by Twilio
  | 'queued'        // Message queued for delivery
  | 'sending'       // Message is being sent
  | 'sent'          // Message sent to carrier
  | 'receiving'     // Message is being received
  | 'received'      // Message received by recipient
  | 'delivered'     // Message delivered to recipient
  | 'undelivered'   // Message could not be delivered
  | 'failed'        // Message failed to send
  | 'read';         // Message read by recipient (if supported)

// Error Response Type
export interface TwilioError {
  code: number;
  message: string;
  moreInfo: string;
  status: number;
  details?: Record<string, any>;
}

// Service Response Type - for handling both success and error cases
export interface TwilioServiceResponse<T = TwilioMessageResponse> {
  success: boolean;
  data?: T;
  error?: TwilioError;
}

// CRM Integration Types - for connecting with your lead system
export interface CRMNotificationParams {
  leadId: string;       // Lead identifier from your CRM
  phoneNumber: string;  // Lead's phone number
  messageTemplate: string; // Message template/content
  personalizedData?: Record<string, string>; // Data for message personalization
  priority?: 'low' | 'medium' | 'high' | 'urgent'; // Message priority
  scheduledTime?: Date; // Optional: schedule message for later
  campaignId?: string;  // Optional: campaign identifier
  tags?: string[];      // Optional: message tags for tracking
}

// Webhook Event Types (if you plan to handle delivery status)
export interface TwilioWebhookEvent {
  MessageSid: string;
  MessageStatus: TwilioMessageStatus;
  To: string;
  From: string;
  Body: string;
  AccountSid: string;
  ApiVersion: string;
  ErrorCode?: string;
  ErrorMessage?: string;
}
