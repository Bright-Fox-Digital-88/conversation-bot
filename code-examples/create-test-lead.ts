import * as ZOHOCRMSDK from "@zohocrm/typescript-sdk-8.0";
import { initializeZoho } from './zoho-init';

async function createTestLead() {
    try {
        await initializeZoho();

        let recordOperations: ZOHOCRMSDK.Record.RecordOperations = new ZOHOCRMSDK.Record.RecordOperations("Leads");
        let request: ZOHOCRMSDK.Record.BodyWrapper = new ZOHOCRMSDK.Record.BodyWrapper();
        let recordsArray = [];

        let record: ZOHOCRMSDK.Record.Record = new ZOHOCRMSDK.Record.Record();
        
        // Set mandatory fields
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.FIRST_NAME, "TestDummy");
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.LAST_NAME, "McTest");
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.COMPANY, "Test Company");
        
        // Set our custom Test field
        record.addKeyValue("Test", "This is a test value");

        recordsArray.push(record);
        request.setData(recordsArray);

        let response = await recordOperations.createRecords(request);
        
        if (response != null) {
            console.log("Status Code: " + response.getStatusCode());
            let responseObject = response.getObject();
            if (responseObject instanceof ZOHOCRMSDK.Record.ActionWrapper) {
                let actionResponses = responseObject.getData();
                actionResponses.forEach(actionResponse => {
                    if (actionResponse instanceof ZOHOCRMSDK.Record.SuccessResponse) {
                        console.log("Record created successfully!");
                        console.log("Record ID: " + actionResponse.getDetails().get("id"));
                    } else if (actionResponse instanceof ZOHOCRMSDK.Record.APIException) {
                        console.error("Error creating record:");
                        console.error("Status:", actionResponse.getStatus().getValue());
                        console.error("Code:", actionResponse.getCode().getValue());
                        console.error("Details:", actionResponse.getDetails());
                        console.error("Message:", actionResponse.getMessage().getValue());
                    }
                });
            }
        }
    } catch (error) {
        console.error("Error creating test lead:", error);
        if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }
    }
}

// Run the script
createTestLead().catch(console.error); 