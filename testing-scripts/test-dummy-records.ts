import { generateLeadsFromDummy } from '../src/functions/record-functions/dummy-records';
import * as fs from 'fs/promises';
import * as path from 'path';

(async () => {
    console.log('Starting generateLeadsFromDummy for stream...');
    try {
        const configPath = path.resolve(__dirname, '../src/demo-config.json');
        const configContent = await fs.readFile(configPath, 'utf-8');
        const config = JSON.parse(configContent);
        await generateLeadsFromDummy(config, 'stream');
        console.log('generateLeadsFromDummy completed successfully.');
    } catch (err) {
        console.error('Error during generateLeadsFromDummy:', err);
    }
})(); 