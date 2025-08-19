import { loadPromptConfig } from '@repositories/prompts/prompt.repo';
import { getConversation, upsertConversation } from './conversationsStore';
import { generateChatCompletion } from '@services/openai/chat';
import { sendText } from '@utilities/twilio';
import { startTimerFor } from './timers';
import { MessagePayload } from '@models/conversation/session.model';

export async function aiMessageNew(senderPhone: string, promptId?: string, targetNumber?: string): Promise<void> {
  const prompt = loadPromptConfig(promptId);
  if (!targetNumber) throw new Error('targetNumber required for aiMessageNew');

  const payload: MessagePayload = {
    model: prompt.model,
    api_params: prompt.api_params,
    messages: [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.init_user }
    ]
  };

  const { content } = await generateChatCompletion({ model: payload.model, messages: payload.messages, api_params: payload.api_params });
  await sendText(targetNumber, content);

  payload.messages.push({ role: 'assistant', content });
  upsertConversation(senderPhone, { timestamp: new Date().toISOString(), targetNumber, messagePayload: payload });
  startTimerFor(senderPhone, targetNumber);
}

export async function aiMessage(senderPhone: string, senderMessage: string): Promise<void> {
  const convo = getConversation(senderPhone);
  if (!convo) throw new Error('No active conversation for this phone. Send INIT first.');

  const { targetNumber, messagePayload } = convo;
  messagePayload.messages.push({ role: 'user', content: senderMessage });

  const { content } = await generateChatCompletion({ model: messagePayload.model, messages: messagePayload.messages, api_params: messagePayload.api_params });
  await sendText(targetNumber, content);

  messagePayload.messages.push({ role: 'assistant', content });
  upsertConversation(senderPhone, { messagePayload });
}
