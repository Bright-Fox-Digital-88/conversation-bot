import { wipeAllRecordsAndAssociations } from '../src/functions/record-functions/wipe-all-records';
import * as fs from 'fs/promises';
import * as path from 'path';

async function testWipeAllRecords() {
    console.log('=== Testing wipeAllRecordsAndAssociations ===');
    console.log('This test will wipe all leads from Zoho CRM and reset both id-store.json and stream-id-store.json');
    console.log('========================================================================================');
    
    try {
        // Check id-store.json before wiping
        const idStorePath = path.join(__dirname, '../src/id-store.json');
        if (await fs.access(idStorePath).then(() => true).catch(() => false)) {
            const beforeIdStoreContent = await fs.readFile(idStorePath, 'utf-8');
            const beforeIdStore = JSON.parse(beforeIdStoreContent);
            console.log('id-store.json before wipe:');
            console.log(JSON.stringify(beforeIdStore, null, 2));
        } else {
            console.log('id-store.json does not exist before wipe');
        }
        
        // Check stream-id-store.json before wiping
        const streamIdStorePath = path.join(__dirname, '../src/stream-id-store.json');
        if (await fs.access(streamIdStorePath).then(() => true).catch(() => false)) {
            const beforeStreamIdStoreContent = await fs.readFile(streamIdStorePath, 'utf-8');
            const beforeStreamIdStore = JSON.parse(beforeStreamIdStoreContent);
            console.log('stream-id-store.json before wipe:');
            console.log(JSON.stringify(beforeStreamIdStore, null, 2));
        } else {
            console.log('stream-id-store.json does not exist before wipe');
        }
        
        console.log('\n--- Starting complete wipe operation ---');
        
        // Call the wipe function
        await wipeAllRecordsAndAssociations();
        
        console.log('\n--- Complete wipe operation finished ---');
        
        // Check id-store.json after wiping
        if (await fs.access(idStorePath).then(() => true).catch(() => false)) {
            const afterIdStoreContent = await fs.readFile(idStorePath, 'utf-8');
            const afterIdStore = JSON.parse(afterIdStoreContent);
            console.log('id-store.json after wipe:');
            console.log(JSON.stringify(afterIdStore, null, 2));
        } else {
            console.log('id-store.json does not exist after wipe');
        }
        
        // Check stream-id-store.json after wiping
        if (await fs.access(streamIdStorePath).then(() => true).catch(() => false)) {
            const afterStreamIdStoreContent = await fs.readFile(streamIdStorePath, 'utf-8');
            const afterStreamIdStore = JSON.parse(afterStreamIdStoreContent);
            console.log('stream-id-store.json after wipe:');
            console.log(JSON.stringify(afterStreamIdStore, null, 2));
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
testWipeAllRecords()
    .then(() => {
        console.log('Test script finished successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Test script failed:', error);
        process.exit(1);
    }); 