import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateChatCompletion(payload: {
  model: string;
  messages: Array<{role:'system'|'user'|'assistant'; content: string}>;
  api_params: Record<string, any>;
}): Promise<{ content: string }> {
  const { model, messages, api_params } = payload;
  const resp = await client.chat.completions.create({
    model,
    messages,
    ...api_params
  } as any);
  const content = resp.choices?.[0]?.message?.content ?? '';
  return { content };
}
