import { wipeAllLeadsAndAssociations } from '../src/functions/crm-functions/wipe-leads';

async function testWipeLeads() {
    try {
        console.log('⚠️  Starting wipe of all leads and their associations...');
        await wipeAllLeadsAndAssociations();
        console.log('✅ Wipe operation completed.');
    } catch (error) {
        console.error('❌ Wipe operation failed:', error);
    }
}

testWipeLeads(); 