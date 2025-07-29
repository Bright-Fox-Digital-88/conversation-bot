import * as ZOHOCRMSDK from "@zohocrm/typescript-sdk-8.0";
import { initializeZoho } from '../zoho-init';

async function getAllLeadIds(): Promise<string[]> {
    try {
        let recordOperations: ZOHOCRMSDK.Record.RecordOperations = new ZOHOCRMSDK.Record.RecordOperations("Leads");
        let paramInstance = new ZOHOCRMSDK.ParameterMap();
        
        // We only need the ID field
        await paramInstance.add(ZOHOCRMSDK.Record.GetRecordsParam.FIELDS, "id");

        let response = await recordOperations.getRecords(paramInstance);
        let leadIds: string[] = [];

        if (response != null) {
            let responseObject = response.getObject();
            if (responseObject instanceof ZOHOCRMSDK.Record.ResponseWrapper) {
                let records = responseObject.getData();
                leadIds = records.map(record => record.getId().toString());
                console.log(`Found ${leadIds.length} leads to delete`);
            }
        }

        return leadIds;
    } catch (error) {
        console.error("Error getting lead IDs:", error);
        return [];
    }
}

async function deleteLeads(leadIds: string[]) {
    try {
        if (leadIds.length === 0) {
            console.log("No leads to delete");
            return;
        }

        let recordOperations: ZOHOCRMSDK.Record.RecordOperations = new ZOHOCRMSDK.Record.RecordOperations("Leads");
        let paramInstance = new ZOHOCRMSDK.ParameterMap();
        
        // Add the IDs to delete
        await paramInstance.add(ZOHOCRMSDK.Record.DeleteRecordsParam.IDS, leadIds.join(","));

        let response = await recordOperations.deleteRecords(paramInstance);
        
        if (response != null) {
            let responseObject = response.getObject();
            if (responseObject instanceof ZOHOCRMSDK.Record.ActionWrapper) {
                let actionResponses = responseObject.getData();
                
                let successCount = 0;
                let failureCount = 0;

                actionResponses.forEach(actionResponse => {
                    if (actionResponse instanceof ZOHOCRMSDK.Record.SuccessResponse) {
                        successCount++;
                    } else if (actionResponse instanceof ZOHOCRMSDK.Record.APIException) {
                        failureCount++;
                        console.error("Error deleting record:", actionResponse.getMessage().getValue());
                    }
                });

                console.log(`\nDeletion Results:`);
                console.log(`Successfully deleted: ${successCount} leads`);
                if (failureCount > 0) {
                    console.log(`Failed to delete: ${failureCount} leads`);
                }
            }
        }
    } catch (error) {
        console.error("Error deleting leads:", error);
    }
}

async function wipeLeads() {
    try {
        console.log("Initializing Zoho CRM SDK...");
        await initializeZoho();
        
        console.log("\nFetching all lead IDs...");
        const leadIds = await getAllLeadIds();
        
        console.log("\nDeleting all leads...");
        await deleteLeads(leadIds);
        
    } catch (error) {
        console.error("Error in wipe operation:", error);
    }
}

// Run the wipe operation
wipeLeads().catch(console.error); 