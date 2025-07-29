import fs from 'fs';

export function loadJson<T>(filePath: string): T {
  try {
    const contents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(contents) as T;
  } catch (error: any) {
    console.error(`[FileLoader] Failed to load JSON from ${filePath}:`, error.message);
    throw new Error(`Could not load file at ${filePath}`);
  }
}
