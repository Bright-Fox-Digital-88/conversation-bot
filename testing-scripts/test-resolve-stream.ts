import { generateLeadsFromStream } from '../src/functions/record-functions/stream-in';
import { resolveStreamStep } from '../src/functions/record-functions/resolve-stream';
import * as fs from 'fs/promises';
import * as path from 'path';

(async () => {
    // Easy to configure step integer for experimentation
    const stepToRun = 0; // Change this to test different steps (0, 1, 2, etc.)
    
    console.log('==============================');
    console.log(`Testing resolve-stream with step ${stepToRun}`);
    console.log('==============================');
    
    try {
        // Step 1: Run stream-in logic for 'stream'
        console.log('Step 1: Running stream-in for stream...');
        await generateLeadsFromStream('stream');
        console.log('Step 1 complete: stream-in finished for stream.');
        console.log('==============================');
        
        // Step 2: Load demo-config.json and stream-id-store.json
        console.log('Step 2: Loading demo-config.json and stream-id-store.json...');
        const demoConfigPath = path.resolve(__dirname, '../src/demo-config.json');
        const streamIdStorePath = path.resolve(__dirname, '../src/stream-id-store.json');
        const demoConfigContent = await fs.readFile(demoConfigPath, 'utf-8');
        const streamIdStoreContent = await fs.readFile(streamIdStorePath, 'utf-8');
        const demoConfig = JSON.parse(demoConfigContent);
        const streamIdStore = JSON.parse(streamIdStoreContent);
        console.log('Step 2 complete: Loaded configuration files.');
        console.log('==============================');
        
        // Step 3: Run resolve-stream logic
        console.log(`Step 3: Running resolve-stream for step ${stepToRun}...`);
        await resolveStreamStep(demoConfig, streamIdStore, stepToRun);
        console.log(`Step 3 complete: resolve-stream finished for step ${stepToRun}.`);
        console.log('==============================');
        
        console.log('All steps completed successfully.');
    } catch (err) {
        console.error('Error in test-resolve-stream:', err);
    }
})(); 