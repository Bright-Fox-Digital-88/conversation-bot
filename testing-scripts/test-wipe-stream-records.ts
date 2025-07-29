import { wipeAllStreamRecordsAndAssociations } from '../src/functions/record-functions/wipe-stream-primes';
import * as fs from 'fs';
import * as path from 'path';

async function testWipeStreamRecords() {
    console.log('=== Testing wipeAllStreamRecordsAndAssociations ===');
    
    try {
        // Check if stream-id-store.json exists before wiping
        const streamIdStorePath = path.join(__dirname, '../src/stream-id-store.json');
        if (fs.existsSync(streamIdStorePath)) {
            const beforeContent = fs.readFileSync(streamIdStorePath, 'utf-8');
            console.log('stream-id-store.json before wipe:');
            console.log(beforeContent);
        } else {
            console.log('stream-id-store.json does not exist before wipe');
        }
        
        console.log('\n--- Starting wipe operation ---');
        
        // Call the wipe function
        await wipeAllStreamRecordsAndAssociations();
        
        console.log('\n--- Wipe operation completed ---');
        
        // Check stream-id-store.json after wiping
        if (fs.existsSync(streamIdStorePath)) {
            const afterContent = fs.readFileSync(streamIdStorePath, 'utf-8');
            console.log('stream-id-store.json after wipe:');
            console.log(afterContent);
        } else {
            console.log('stream-id-store.json does not exist after wipe');
        }
        
        console.log('\n=== Test completed successfully ===');
        
    } catch (error) {
        console.error('Error during test:', error);
        throw error;
    }
}

// Run the test
testWipeStreamRecords()
    .then(() => {
        console.log('Test script finished successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Test script failed:', error);
        process.exit(1);
    }); 