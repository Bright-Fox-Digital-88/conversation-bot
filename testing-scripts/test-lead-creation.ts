import { createTestLead } from '../code-examples/create-test-lead';

async function testLeadCreation() {
    try {
        const result = await createTestLead({
            firstName: "Test",
            lastName: "User",
            company: "Test Company Ltd",
            testValue: "Test creation from new implementation"
        });

        console.log("Test lead creation result:", result);
    } catch (error) {
        console.error("Failed to create test lead:", error);
    }
}

// Run the test
testLeadCreation().catch(console.error); 