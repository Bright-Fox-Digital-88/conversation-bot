import { wipeAllStreamRecordsAndAssociations } from '../src/functions/record-functions/wipe-stream-primes';
import { generateLeadsFromStream } from '../src/functions/record-functions/stream-in';
import { resolveStreamStep } from '../src/functions/record-functions/resolve-stream';
import * as fs from 'fs/promises';
import * as path from 'path';

async function testStreamWorkflow() {
    console.log('=== Testing Complete Stream Workflow ===');
    console.log('This test will:');
    console.log('1. Wipe all stream records and associations');
    console.log('2. Run stream-in to generate initial leads');
    console.log('3. Resolve stream at step 0');
    console.log('==========================================');
    
    try {
        // Step 1: Wipe stream primes
        console.log('\n--- Step 1: Wiping all stream records and associations ---');
        await wipeAllStreamRecordsAndAssociations();
        console.log('Step 1 complete: All stream records wiped.');
        
        // Step 2: Stream-in
        console.log('\n--- Step 2: Running stream-in for stream ---');
        await generateLeadsFromStream('stream');
        console.log('Step 2 complete: Stream-in finished for stream.');
        
        // Step 3: Load configuration files
        console.log('\n--- Step 3: Loading configuration files ---');
        const demoConfigPath = path.resolve(__dirname, '../src/demo-config.json');
        const streamIdStorePath = path.resolve(__dirname, '../src/stream-id-store.json');
        
        const demoConfigContent = await fs.readFile(demoConfigPath, 'utf-8');
        const streamIdStoreContent = await fs.readFile(streamIdStorePath, 'utf-8');
        
        const demoConfig = JSON.parse(demoConfigContent);
        const streamIdStore = JSON.parse(streamIdStoreContent);
        
        console.log('Configuration files loaded successfully.');
        console.log('stream-id-store.json after stream-in:');
        console.log(JSON.stringify(streamIdStore, null, 2));
        
        // Step 4: Resolve stream at step 0
        console.log('\n--- Step 4: Resolving stream at step 0 ---');
        await resolveStreamStep(demoConfig, streamIdStore, 0);
        console.log('Step 4 complete: Resolve stream finished for step 0.');
        
        // Final check
        console.log('\n--- Final state check ---');
        const finalStreamIdStoreContent = await fs.readFile(streamIdStorePath, 'utf-8');
        const finalStreamIdStore = JSON.parse(finalStreamIdStoreContent);
        console.log('Final stream-id-store.json:');
        console.log(JSON.stringify(finalStreamIdStore, null, 2));
        
        console.log('\n=== Stream workflow test completed successfully ===');
        
    } catch (error) {
        console.error('Error during stream workflow test:', error);
        throw error;
    }
}

// Run the test
testStreamWorkflow()
    .then(() => {
        console.log('Test script finished successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Test script failed:', error);
        process.exit(1);
    }); 