import { generateLead } from '../src/functions/crm-functions/lead-functions';
import sampleData from '../src/prime/sally-scanner/out.json';

async function testLeadGeneration() {
    try {
        // Test 1: Original sample data
        console.log('🔍 Test 1: Original sample data');
        const result1 = await generateLead(sampleData[0]);
        if (result1.success) {
            console.log('✅ Lead created successfully!');
            console.log('📝 Lead ID:', result1.recordId);
        } else {
            console.error('❌ Failed to create lead:', result1.error?.message);
        }

        // Test 2: Template with null values
        console.log('\n🔍 Test 2: Template with null values');
        const templateData = {
            name: "template-test",
            Fields: {
                "First Name": "Template",
                "Last Name": "Test",
                "Company": null,
                "Email": undefined,
                "Phone": null,
                "Last Lendex Update": new Date(2020, 0, 1) // This should be overridden
            },
            Notes: [],
            Tags: []
        };

        const result2 = await generateLead(templateData);
        if (result2.success) {
            console.log('✅ Lead created successfully!');
            console.log('📝 Lead ID:', result2.recordId);
        } else {
            console.error('❌ Failed to create lead:', result2.error?.message);
        }
    } catch (error) {
        console.error('❌ Error running test:', error);
    }
}

// Run the test
testLeadGeneration().catch(console.error); 