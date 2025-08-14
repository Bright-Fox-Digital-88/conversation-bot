// Loads {promptId}.json or default.json from /src/repositories/prompts/data. Throws with help if default.json is missing.
import fs from 'fs';
import path from 'path';
import { PromptConfig } from '@models/conversation/session.model';

const DATA_DIR = path.resolve(process.cwd(), 'src', 'repositories', 'prompts', 'data');

export function loadPromptConfig(promptId?: string): PromptConfig {
  const chosen = promptId ? `${promptId}.json` : 'default.json';
  const chosenPath = path.join(DATA_DIR, chosen);
  const defaultPath = path.join(DATA_DIR, 'default.json');

  if (!fs.existsSync(defaultPath)) {
    console.error('[Prompts] Missing default.json. It must exist with shape:', {
      model: 'gpt-5',
      api_params: { temperature: 0.7, max_tokens: 256, top_p: 1, presence_penalty: 0, frequency_penalty: 0 },
      system: 'string',
      init_user: 'string'
    });
    throw new Error('default.json not found in /src/repositories/prompts/data/');
  }

  const filePath = fs.existsSync(chosenPath) ? chosenPath : defaultPath;
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as PromptConfig;
}
