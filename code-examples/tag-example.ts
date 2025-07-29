import * as ZOHOCRMSDK from "@zohocrm/typescript-sdk-8.0";
import { initializeZoho } from '../../zoho-init';

async function addTagsToLead(recordId: string, tags: string[]) {
    try {
        await initializeZoho();

        let recordOperations: ZOHOCRMSDK.Record.RecordOperations = new ZOHOCRMSDK.Record.RecordOperations("Leads");
        let request: ZOHOCRMSDK.Record.BodyWrapper = new ZOHOCRMSDK.Record.BodyWrapper();
        let record: ZOHOCRMSDK.Record.Record = new ZOHOCRMSDK.Record.Record();

        // Format tags into Tag objects
        let tagList = tags.map(tagName => {
            let tag = new ZOHOCRMSDK.Tags.Tag();
            tag.setName(tagName);
            return tag;
        });
        
        // Add the tags to the record - convert ID to BigInt
        record.addKeyValue("id", BigInt(recordId));
        record.addKeyValue("Tag", tagList);

        request.setData([record]);
        let response = await recordOperations.updateRecords(request);

        if (response != null) {
            let responseObject = response.getObject();
            if (responseObject instanceof ZOHOCRMSDK.Record.ActionWrapper) {
                let actionResponse = responseObject.getData()[0];
                if (actionResponse instanceof ZOHOCRMSDK.Record.SuccessResponse) {
                    console.log(`Successfully added tags to lead ${recordId}`);
                    return true;
                } else if (actionResponse instanceof ZOHOCRMSDK.Record.APIException) {
                    throw new Error(`API Error: ${actionResponse.getMessage().getValue()}`);
                }
            }
        }
        throw new Error("Failed to update lead - no response");
    } catch (error) {
        console.error('Error adding tags:', error);
        throw error;
    }
}

// Add the Johnny Blunami tag to john-smith-a
async function addJohnnyBlunamiTag() {
    try {
        const leadId = "6884220000000609001"; // john-smith-a ID
        const tags = ["Johnny Blunami"];
        
        await addTagsToLead(leadId, tags);
        console.log("Successfully added Johnny Blunami tag");
    } catch (error) {
        console.error("Error adding Johnny Blunami tag:", error);
    }
}

// Run the tag addition
addJohnnyBlunamiTag().catch(console.error);

export { addTagsToLead }; 