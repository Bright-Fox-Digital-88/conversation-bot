import * as ZOHOCRMSDK from "@zohocrm/typescript-sdk-8.0";
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from custom.env
dotenv.config({ path: path.join(__dirname, '..', 'custom.env') });

export async function initializeZoho() {
    try {
        if (!process.env.ZOHO_CLIENT_ID || !process.env.ZOHO_CLIENT_SECRET || !process.env.ZOHO_REFRESH_TOKEN) {
            throw new Error("Missing required environment variables");
        }

        const environment = ZOHOCRMSDK.USDataCenter.PRODUCTION();
        const token = new ZOHOCRMSDK.OAuthBuilder()
            .clientId(process.env.ZOHO_CLIENT_ID)
            .clientSecret(process.env.ZOHO_CLIENT_SECRET)
            .refreshToken(process.env.ZOHO_REFRESH_TOKEN)
            .build();

        await (await new ZOHOCRMSDK.InitializeBuilder())
            .environment(environment)
            .token(token)
            .initialize();

        console.log("Zoho CRM SDK initialized successfully");

    } catch (error) {
        console.error("Error initializing Zoho CRM SDK:", error);
        throw error;
    }
} 