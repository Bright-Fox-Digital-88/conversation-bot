import { createComprehensiveTestLead } from '../code-examples/create-all-fields-lead';

async function runTest() {
    try {
        console.log('Starting comprehensive lead creation test...');
        
        const result = await createComprehensiveTestLead();
        
        if (!result) {
            console.error('No result returned from lead creation');
            return;
        }

        if (result.success) {
            console.log('Successfully created comprehensive test lead!');
            console.log('Record ID:', result.recordId);
            console.log('Message:', result.message);
        } else {
            console.error('Failed to create lead:', result.error);
        }
        
    } catch (error: any) { // Type assertion for error object
        console.error('Error creating comprehensive test lead:', error);
        if (error?.response?.body) {
            console.error('API Response:', error.response.body);
        }
    }
}

// Run the test
runTest(); 