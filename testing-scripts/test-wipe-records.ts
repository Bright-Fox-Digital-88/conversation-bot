import { wipeAllRecordsAndAssociations } from '../src/functions/record-functions/wipe-records';

(async () => {
    console.log('Starting wipeAllRecordsAndAssociations...');
    try {
        await wipeAllRecordsAndAssociations();
        console.log('wipeAllRecordsAndAssociations completed successfully.');
    } catch (err) {
        console.error('Error during wipeAllRecordsAndAssociations:', err);
    }
})(); 