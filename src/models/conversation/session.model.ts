/* Contracts for per-sender conversations and prompt configs. */

export interface PromptConfig {
  model: string;
  api_params: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
    [k: string]: any;
  };
  system: string;
  init_user: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface MessagePayload {
  model: string;
  api_params: Record<string, any>;
  messages: ChatMessage[];
}

export interface ConversationEntry {
  timestamp: string;          // ISO
  timerId: string | null;     // public token; actual Timeout held in memory
  targetNumber: string;       // Twilio bot number to reply from
  messagePayload: MessagePayload;
}
