import * as ZOHOCRMSDK from "@zohocrm/typescript-sdk-8.0";
import { initializeZohoConnection } from '../src/functions/zoho-connection';
import { 
    Industry,
    LeadSource,
    LeadStatus,
    PoliticalAffiliation,
    Rating
} from '../src/functions/types/lead-enums';

interface CreateLeadResponse {
    success: boolean;
    recordId?: string;
    message?: string;
    error?: {
        status: string;
        code: string;
        details: Map<string, any>;
        message: string;
    };
}

export async function createComprehensiveTestLead(): Promise<CreateLeadResponse> {
    try {
        // Initialize the connection
        await initializeZohoConnection();

        // Setup record operations
        const recordOperations = new ZOHOCRMSDK.Record.RecordOperations("Leads");
        const request = new ZOHOCRMSDK.Record.BodyWrapper();
        const recordsArray: ZOHOCRMSDK.Record.Record[] = [];

        // Create new record
        const record = new ZOHOCRMSDK.Record.Record();
        
        // Basic Information
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.FIRST_NAME, "ComprehensiveTest");
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.LAST_NAME, "AllFields");
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.COMPANY, "Test Company Inc.");
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.EMAIL, "test@example.com");
        record.addKeyValue("Title", "Chief Testing Officer");
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.PHONE, "555-0123");
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.MOBILE, "555-4567");
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.WEBSITE, "https://example.com");
        record.addKeyValue("Secondary_Email", "backup@example.com");
        record.addKeyValue("Fax", "555-8901");
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.EMAIL_OPT_OUT, false);

        // Enum Fields using Choice
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.LEAD_SOURCE, new ZOHOCRMSDK.Choice(LeadSource.WebDownload));
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.LEAD_STATUS, new ZOHOCRMSDK.Choice(LeadStatus.Contacted));
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.INDUSTRY, new ZOHOCRMSDK.Choice(Industry.ASP));
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.RATING, new ZOHOCRMSDK.Choice(Rating.ACTIVE));

        // Custom Fields and Enums
        record.addKeyValue("Political_Affiliation", new ZOHOCRMSDK.Choice(PoliticalAffiliation.INDEPENDENT));
        record.addKeyValue("Annual_Revenue", 1000000);
        record.addKeyValue("Number_of_Employees", 50);

        // Social & Communication
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.TWITTER, "testuser");
        record.addKeyValue("Skype_ID", "test.user123");

        // Address Information
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.STREET, "123 Test Street");
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.CITY, "Test City");
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.STATE, "Test State");
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.ZIP_CODE, "12345");
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.COUNTRY, "Test Country");

        // Vehicle Information
        record.addKeyValue("Year", "2023");
        record.addKeyValue("Make", "Tesla");
        record.addKeyValue("Model", "Model Y");
        record.addKeyValue("Mileage", "15000");
        record.addKeyValue("Estimated_Trade_Value", 45000);

        // Finance Information
        record.addKeyValue("Current_Equity", 25000);
        record.addKeyValue("Loan_Amount", 35000);
        record.addKeyValue("Interest_Rate", 4.5);
        record.addKeyValue("Payment", 650);
        record.addKeyValue("Current_Balance", 30000);

        // Credit & Finance Data
        record.addKeyValue("Buying_Power_Score", 85);
        record.addKeyValue("Credit_Tier", 1);
        record.addKeyValue("Estimated_Income", 120000);

        // Browsing Behavior
        record.addKeyValue("Search_History", "SUV, Electric Vehicles, Luxury Cars");
        record.addKeyValue("Video_History", "Test Drive Reviews, Feature Demonstrations");
        record.addKeyValue("Web_Browsing_Behavior", "High engagement with pricing pages");

        // Personal Information
        record.addKeyValue("Children", "2");
        record.addKeyValue("Likes_Dislikes", "Likes: Technology, Sustainability\nDislikes: High maintenance costs");
        record.addKeyValue("Pet_Owner", true);

        // Lendex Specific Fields
        record.addKeyValue("Last_Lendex_Update", new Date());
        record.addKeyValue("Update_Notes", "Comprehensive test lead creation");
        record.addKeyValue("Change_Log", "Initial creation with all fields populated");
        record.addKeyValue("Lendex_Score", 92);
        record.addKeyValue("Lendex_Enhanced", true);

        // Identity Resolution
        record.addKeyValue("Duplicate", false);

        // Description
        record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.DESCRIPTION, "This is a comprehensive test lead with all fields populated");

        recordsArray.push(record);
        request.setData(recordsArray);

        const response = await recordOperations.createRecords(request);
        
        if (response !== null) {
            const responseObject = response.getObject();
            if (responseObject instanceof ZOHOCRMSDK.Record.ActionWrapper) {
                const actionResponses = responseObject.getData();
                if (actionResponses.length > 0) {
                    const actionResponse = actionResponses[0];
                    
                    if (actionResponse instanceof ZOHOCRMSDK.Record.SuccessResponse) {
                        return {
                            success: true,
                            recordId: actionResponse.getDetails().get("id"),
                            message: "Record created successfully"
                        };
                    } else if (actionResponse instanceof ZOHOCRMSDK.Record.APIException) {
                        return {
                            success: false,
                            error: {
                                status: actionResponse.getStatus().getValue(),
                                code: actionResponse.getCode().getValue(),
                                details: actionResponse.getDetails(),
                                message: actionResponse.getMessage().getValue()
                            }
                        };
                    }
                }
            }
        }
        
        return {
            success: false,
            error: {
                status: "UNKNOWN",
                code: "UNKNOWN",
                details: new Map(),
                message: "Unknown error occurred"
            }
        };
        
    } catch (error) {
        console.error("❌ Error creating comprehensive test lead:", error);
        throw error;
    }
}
