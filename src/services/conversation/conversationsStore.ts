import fs from 'fs';
import path from 'path';
import { ConversationEntry } from '@models/conversation/session.model';

const FILE = path.resolve(process.cwd(), 'src', 'repositories', 'conversation', 'data', 'conversations.json');

/**
 * Read all conversations from the JSON file
 */
function readAll(): Record<string, ConversationEntry> {
  if (!fs.existsSync(FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch (error) {
    console.error('Error reading conversations file:', error);
    return {};
  }
}

/**
 * Write all conversations to the JSON file
 */
function writeAll(data: Record<string, ConversationEntry>) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing conversations file:', error);
  }
}

/**
 * Get a conversation by sender phone number
 */
export function getConversation(senderPhone: string): ConversationEntry | undefined {
  return readAll()[senderPhone];
}

/**
 * Upsert (insert/merge) a conversation for a sender phone number
 */
export function upsertConversation(senderPhone: string, patch: Partial<ConversationEntry>) {
  const all = readAll();
  const existing = all[senderPhone] ?? {
    timestamp: new Date().toISOString(),
    timerId: null,
    targetNumber: '',
    messagePayload: { model: '', api_params: {}, messages: [] }
  } as ConversationEntry;
  
  // Merge existing data with patch
  all[senderPhone] = { ...existing, ...patch } as ConversationEntry;
  writeAll(all);
}

/**
 * Delete a conversation by sender phone number
 */
export function deleteConversation(senderPhone: string) {
  const all = readAll();
  delete all[senderPhone];
  writeAll(all);
}

/**
 * List all active phone numbers
 */
export function listActivePhones(): string[] {
  return Object.keys(readAll());
}

/**
 * Clear all conversations and return the list of phone numbers that were cleared
 */
export function clearAllConversations(): string[] {
  const phones = Object.keys(readAll());
  writeAll({});
  return phones;
}
