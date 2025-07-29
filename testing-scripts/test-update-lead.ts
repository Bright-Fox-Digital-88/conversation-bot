import { updateLead } from '../src/functions/crm-functions/udpate-lead-functions';

(async () => {
    const leadId = '6884220000000649002';
    const fields = { 'Lendex Enhanced': true };
    console.log(`Updating lead ${leadId} with Lendex Enhanced = true...`);
    try {
        const result = await updateLead({ leadId, Fields: fields });
        console.log('Update result:', result);
    } catch (err) {
        console.error('Error updating lead:', err);
    }
})(); 