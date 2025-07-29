import path from 'path';
import { loadJson } from '@/utilities/fileLoader';
import { SystemMessage } from '@models/conversation/conversation.model';

export function getConversationScript(): string[] {
  const filePath = path.resolve(__dirname, 'data', 'carl_contact.json');
  return loadJson<string[]>(filePath);
}

export function getSystemMessages(): SystemMessage {
  const filePath = path.resolve(__dirname, 'data', 'systemMessages.json');
  return loadJson<SystemMessage>(filePath);
}
