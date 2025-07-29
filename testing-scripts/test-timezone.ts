import { getOrgTimezone } from '../src/functions/crm-functions/org-functions';
import { generateLead } from '../src/functions/crm-functions/crm-functions';
import moment from 'moment-timezone';

async function testTimezoneHandling() {
    try {
        // First, get the organization's timezone
        console.log('🔍 Getting organization timezone...');
        const timezone = await getOrgTimezone();
        console.log('✅ Organization timezone:', timezone);

        // Create a test record
        const testData = {
            name: "timezone-test",
            Fields: {
                "First Name": "Timezone",
                "Last Name": "Test",
                "Last Lendex Update": new Date(2020, 0, 1) // This should be overridden
            }
        };

        // Log local time
        console.log('\n📅 Local time:', moment().format('YYYY-MM-DD HH:mm:ss'));
        console.log('📅 Time in org timezone:', moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss'));
        
        // Generate the lead
        console.log('\n🔍 Creating test lead...');
        const result = await generateLead(testData);
        
        if (result.success) {
            console.log('✅ Lead created successfully!');
            console.log('📝 Lead ID:', result.recordId);
            console.log('\nPlease verify in Zoho CRM that the Last Lendex Update timestamp matches your organization timezone.');
        } else {
            console.error('❌ Failed to create lead:', result.error?.message);
        }
    } catch (error) {
        console.error('❌ Error running test:', error);
    }
}

// Run the test
testTimezoneHandling().catch(console.error); 