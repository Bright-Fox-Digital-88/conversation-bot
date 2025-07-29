import { wipeStreamRecordsOnly } from '../src/functions/record-functions/wipe-stream-primes';
import * as fs from 'fs';
import * as path from 'path';

async function testTargetedWipe() {
    console.log('=== Testing Targeted Stream Wipe ===');
    console.log('This test will only wipe leads tracked in stream-id-store.json');
    console.log('=====================================');
    
    try {
        // Check stream-id-store.json before wiping
        const streamIdStorePath = path.join(__dirname, '../src/stream-id-store.json');
        if (fs.existsSync(streamIdStorePath)) {
            const beforeContent = fs.readFileSync(streamIdStorePath, 'utf-8');
            const beforeStore = JSON.parse(beforeContent);
            console.log('stream-id-store.json before wipe:');
            console.log(JSON.stringify(beforeStore, null, 2));
            
            // Count how many leads have IDs
            const leadCount = Object.values(beforeStore).filter((record: any) => record.id).length;
            console.log(`Found ${leadCount} leads with IDs in stream-id-store.json`);
        } else {
            console.log('stream-id-store.json does not exist before wipe');
        }
        
        console.log('\n--- Starting targeted wipe operation ---');
        
        // Call the targeted wipe function
        await wipeStreamRecordsOnly();
        
        console.log('\n--- Targeted wipe operation completed ---');
        
        // Check stream-id-store.json after wiping
        if (fs.existsSync(streamIdStorePath)) {
            const afterContent = fs.readFileSync(streamIdStorePath, 'utf-8');
            const afterStore = JSON.parse(afterContent);
            console.log('stream-id-store.json after wipe:');
            console.log(JSON.stringify(afterStore, null, 2));
        } else {
            console.log('stream-id-store.json does not exist after wipe');
        }
        
        console.log('\n=== Targeted wipe test completed successfully ===');
        
    } catch (error) {
        console.error('Error during targeted wipe test:', error);
        throw error;
    }
}

// Run the test
testTargetedWipe()
    .then(() => {
        console.log('Test script finished successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Test script failed:', error);
        process.exit(1);
    }); 