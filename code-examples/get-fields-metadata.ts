import * as ZOHOCRMSDK from "@zohocrm/typescript-sdk-8.0";
import * as fs from 'fs';
import * as path from 'path';
import { initializeZoho } from './zoho-init';

// Custom replacer function to handle BigInt serialization
const jsonReplacer = (key: string, value: any) => {
    if (typeof value === 'bigint') {
        return value.toString();
    }
    return value;
};

async function getFieldsMetadata(module: string) {
    try {
        // Initialize the SDK
        await initializeZoho();

        // Get instance of FieldsOperations Class
        let fieldsOperations = new ZOHOCRMSDK.Fields.FieldsOperations();
        let paramInstance = new ZOHOCRMSDK.ParameterMap();
        
        // Add module parameter
        await paramInstance.add(ZOHOCRMSDK.Fields.GetFieldsParam.MODULE, module);

        // Get the fields metadata
        let response = await fieldsOperations.getFields(paramInstance);

        if (response !== null) {
            // Get the status code from response
            console.log("Status Code: " + response.getStatusCode());

            if ([204, 304].includes(response.getStatusCode())) {
                console.log(response.getStatusCode() == 204 ? "No Content" : "Not Modified");
                return;
            }

            // Get object from response
            let responseObject = response.getObject();

            if (responseObject !== null) {
                // Save to JSON file
                const outputPath = path.join(__dirname, '..', 'metadata', `${module.toLowerCase()}-fields.json`);
                fs.mkdirSync(path.dirname(outputPath), { recursive: true });
                fs.writeFileSync(outputPath, JSON.stringify(responseObject, jsonReplacer, 2));
                console.log(`Fields metadata for ${module} saved to ${outputPath}`);
            }
        }
    } catch (error) {
        console.error(`Error fetching fields metadata for ${module}:`, error);
    }
}

async function main() {
    // Fetch metadata for both modules
    await getFieldsMetadata("Leads");
    await getFieldsMetadata("Contacts");
}

// Run the script
main().catch(console.error); 