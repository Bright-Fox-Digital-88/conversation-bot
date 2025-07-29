// Message type enum for different communication channels
export type MessageType = 'text' | 'email' | 'phone call';

// Message object structure for records
export interface RecordMessage {
    type: MessageType | null;
    ai_agent: boolean | null;
    content: string;
    target_number?: string; // Optional target phone number from JSON
}

// Configuration object with target number and other key-value pairs
export interface ResolveStreamConfig {
    'target-number': string;
    [key: string]: any; // Allow for other key-value pairs
}

export interface SystemMessage {
    "5min": string;
    "reset": string;
  }
  
  export interface ConversationState {
    i: number;
    timer: NodeJS.Timeout | null;
    elapsedMinutes: number;
  }
  