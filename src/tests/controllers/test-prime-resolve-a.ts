import * as fs from 'fs/promises';
import * as path from 'path';
import { resolveStreamStep } from '../../functions/record-functions/resolve-stream';
import { generateLeadsFromStream } from '../../functions/record-functions/stream-in';
import { wipeAllStreamRecordsAndAssociations } from '../../functions/record-functions/wipe-stream-primes';
import { ResolveStreamConfig } from '../../models/conversation/conversation.model';

async function testPrimeResolveA() {
    try {
        console.log('🚀 Starting Prime Resolve A Test - Step 6 (taylor-trade)');
        console.log('=' .repeat(60));

        // Load demo config
        const demoConfigPath = path.resolve(__dirname, '../../demo-config.json');
        const demoConfigContent = await fs.readFile(demoConfigPath, 'utf-8');
        const demoConfig = JSON.parse(demoConfigContent);
        console.log('✅ Demo config loaded');

        // Load stream ID store
        const streamIdStorePath = path.resolve(__dirname, '../../stream-id-store.json');
        const streamIdStoreContent = await fs.readFile(streamIdStorePath, 'utf-8');
        let streamIdStore = JSON.parse(streamIdStoreContent);
        console.log('✅ Stream ID store loaded');

        // First, wipe all existing stream records for a clean test
        console.log('');
        console.log('🧹 Wiping existing stream records for clean test...');
        await wipeAllStreamRecordsAndAssociations();
        console.log('✅ Stream records wiped and stream-id-store.json reset');

        // Reload the reset stream ID store
        const resetStreamIdStoreContent = await fs.readFile(streamIdStorePath, 'utf-8');
        streamIdStore = JSON.parse(resetStreamIdStoreContent);
        console.log('✅ Reset stream ID store reloaded');

        // Then, populate the stream-id-store.json by running stream-in
        console.log('');
        console.log('🔄 Running stream-in to populate initial leads...');
        await generateLeadsFromStream('stream');
        console.log('✅ Stream leads generated and stream-id-store.json populated');

        // Reload the updated stream ID store
        const updatedStreamIdStoreContent = await fs.readFile(streamIdStorePath, 'utf-8');
        streamIdStore = JSON.parse(updatedStreamIdStoreContent);
        console.log('✅ Updated stream ID store reloaded');

        // Configure test parameters
        const step = 6; // Index 6 corresponds to "taylor-trade"
        const config: ResolveStreamConfig = {
            'target-number': '+13134520306'
        };

        console.log('');
        console.log(`📋 Test Configuration:`);
        console.log(`   Step Index: ${step}`);
        console.log(`   Step Name: ${demoConfig.stream.steps[step]}`);
        console.log(`   Target Phone: ${config['target-number']}`);
        console.log('');

        // Execute the resolve stream step
        console.log('🔄 Executing resolveStreamStep...');
        const result = await resolveStreamStep(demoConfig, streamIdStore, step, config);

        console.log('✅ Resolve stream step completed successfully!');
        console.log('');
        console.log('📊 Results Summary:');
        console.log(`   Updated stream ID store entries: ${Object.keys(result).length}`);
        
        // Show the taylor-trade entry specifically
        if (result['taylor-trade']) {
            console.log('');
            console.log('🎯 Taylor-Trade Entry Details:');
            console.log(`   Lead ID: ${result['taylor-trade'].id || 'Not created yet'}`);
            console.log(`   Notes Count: ${result['taylor-trade'].notes?.length || 0}`);
            console.log(`   Tags Count: ${result['taylor-trade'].tags?.length || 0}`);
        }

        console.log('');
        console.log('🎉 Test completed successfully!');

    } catch (error: any) {
        console.error('❌ Test failed with error:');
        console.error(`   Message: ${error.message}`);
        if (error.stack) {
            console.error(`   Stack: ${error.stack}`);
        }
        process.exit(1);
    }
}

// Run the test
testPrimeResolveA();
