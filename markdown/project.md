# Project Overview

Our duty is to create layers levels of functions for this project inside /src/functions/

The project is done in TypeScript and will utilize the Zoho CRM Typescript SDK. If you ever need to write code for it, it is wise to use the Context 7 MCP and reference the documentation quickly

We have several code examples from another project located within /code-examples/ 

For oAuth connections, we are using dotenv sourced from a file called custom.env

ZOHO_CLIENT_ID=
ZOHO_CLIENT_SECRET=
ZOHO_REFRESH_TOKEN=
ZOHO_REDIRECT_URI=

The connection uses self-client setup rather than standard oAuth flow. We created a code with the scopes: `ZohoCRM.modules.ALL,ZohoCRM.settings.ALL`
Converted grant code to refresh token using token endpoint
Updated redirect URI to `https://www.zoho.com` instead of localhost

code can be found from the code examples in /code-examples/zoho-init.ts

# Testing Scripts
All test scripts are located in the `/testing-scripts` directory. To run a test script, use:
```bash
npx ts-node testing-scripts/<script-name>.ts
```

Available test scripts:
- `test-lead-generation.ts` - Tests the new lead generation functionality with sample data
- `test-timezone.ts` - Tests timezone handling for lead timestamps

# Priorities
1. ✅ Establish a connection to Zoho CRM using the self-client oAuth and then generate a test lead with code quite similar to /code-examples/create-test-lead
   - Implemented in:
     - `src/functions/zoho-connection.ts` - Connection handling
     - `src/functions/crm-functions.ts` - Lead creation
     - Test script: `testing-scripts/test-lead-generation.ts`

2. ✅ Implement flexible lead generation with field mapping
   - Created `generateLead` function in `crm-functions.ts`
   - Supports dynamic field mapping from input data
   - Handles null/undefined values by skipping them
   - Automatically sets "Last Lendex Update" timestamp
   - Proper timezone handling using moment-timezone

# Working with Zoho CRM Fields

## Field Types and Methods
When creating leads in Zoho CRM, there are two main methods for setting field values:

1. `addFieldValue()`: Used for standard fields that are part of the SDK's type definitions
   ```typescript
   record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.FIRST_NAME, "John");
   ```

2. `addKeyValue()`: Used for custom fields or fields not in the SDK's type definitions
   ```typescript
   record.addKeyValue("Custom_Field", "Value");
   ```

## Field Categories and Best Practices

### Standard Fields
- Basic Information (First Name, Last Name, Company, etc.)
  - Use `addFieldValue()` with `ZOHOCRMSDK.Record.Field.Leads`
  - Example: `FIRST_NAME`, `LAST_NAME`, `COMPANY`, `EMAIL`

### Enum Fields
- Fields with predefined choices (Lead Source, Industry, etc.)
  - Must use `ZOHOCRMSDK.Choice` object
  - Define enums in separate file for maintainability
  ```typescript
  record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.LEAD_SOURCE, 
    new ZOHOCRMSDK.Choice(LeadSource.WebDownload));
  ```

### Date Fields
- Must use JavaScript Date objects, not strings
- Don't use `toISOString()` - Zoho expects Date objects
  ```typescript
  record.addKeyValue("Last_Update", new Date());
  ```

### Social Media Fields
- Remove special characters (like @ for Twitter)
- Use plain usernames without formatting
  ```typescript
  record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.TWITTER, "username");
  ```

### Numeric Fields
- Can be set directly with numbers
- Use appropriate data types (integer vs float)
  ```typescript
  record.addKeyValue("Credit_Score", 750);
  record.addKeyValue("Interest_Rate", 4.5);
  ```

### Boolean Fields
- Set directly with true/false
  ```typescript
  record.addKeyValue("Email_Opt_Out", false);
  record.addKeyValue("Is_Active", true);
  ```

## Common Pitfalls

1. DateTime Handling
   - Always use `new Date()` objects
   - Don't convert to ISO strings
   - Zoho expects native DateTime objects

2. Enum Fields
   - Must use `ZOHOCRMSDK.Choice`
   - Direct string values will fail
   - Keep enum definitions synchronized with Zoho CRM

3. Field Method Selection
   - Use `addFieldValue()` for standard fields
   - Use `addKeyValue()` for custom fields
   - Wrong method selection causes type errors

4. Social Media Formatting
   - Remove special characters
   - Use plain text values
   - Follow Zoho's field format requirements

## Field Organization Strategy

Organize fields in logical groups for better maintainability:
```typescript
// Basic Information
record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.FIRST_NAME, "John");

// Contact Information
record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.EMAIL, "john@example.com");

// Address Information
record.addFieldValue(ZOHOCRMSDK.Record.Field.Leads.CITY, "New York");

// Custom Fields
record.addKeyValue("Custom_Score", 85);
```

## Type System Development
- Define interfaces for field types
- Use enums for choice fields
- Document field requirements and constraints
- Keep type definitions in separate files
- Example: `src/functions/types/lead-fields.ts`

## Testing Considerations
1. Create comprehensive test leads
2. Test all field types
3. Verify data type handling
4. Check enum value acceptance
5. Validate custom field behavior
6. Monitor API responses for field-specific errors

## Response Handling
```typescript
if (actionResponse instanceof ZOHOCRMSDK.Record.SuccessResponse) {
    return {
        success: true,
        recordId: actionResponse.getDetails().get("id"),
        message: "Record created successfully"
    };
}
```

Remember to handle both success and error cases appropriately, providing meaningful error messages for debugging.

## Recent Improvements

### Lead Generation
- Implemented flexible field mapping system
- Support for template-style input with null/undefined values
- Returns Lead ID for reference and tracking
- Comprehensive error handling and validation

### Timestamp Handling
- Automatic "Last Lendex Update" field population
- Proper timezone support using moment-timezone
- Configurable timezone settings (currently using America/New_York)
- Override protection for "Last Lendex Update" field
