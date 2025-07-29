import { generateLead, addTagsToLead } from '../src/functions/crm-functions/lead-functions';
import sampleData from '../src/prime/sally-scanner/out.json';
import { TagColor } from '../src/functions/types/tag-types';

// Helper to convert color string (e.g., 'ORANGE') to TagColor key (e.g., 'Orange')
function normalizeColor(color: string): keyof typeof TagColor {
    // Find the enum key whose value matches the input string
    const entry = Object.entries(TagColor).find(([, value]) => value === color);
    if (entry) return entry[0] as keyof typeof TagColor;
    throw new Error(`Unknown tag color: ${color}`);
}

async function testTagGeneration() {
    try {
        // First, create a lead using the sample data
        console.log('🔍 Creating test lead...');
        const leadResult = await generateLead(sampleData[0]);
        
        if (!leadResult.success || !leadResult.recordId) {
            console.error('❌ Failed to create lead:', leadResult.error?.message);
            return;
        }

        console.log('✅ Lead created successfully!');
        console.log('📝 Lead ID:', leadResult.recordId);

        // Now add tags to the lead
        console.log('\n🔍 Adding tags to the lead...');
        // Extract tag names only
        const tagNames = sampleData[0].Tags.map((tag: any) => tag["tag-name"]);
        const tagResult = await addTagsToLead(leadResult.recordId, tagNames);

        if (tagResult && tagResult.success) {
            console.log('✅ Tags added successfully!');
            console.log('🏷️ Tag Result:', tagResult);
        } else {
            console.error('❌ Failed to add tags or no tags returned.');
        }

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the test
testTagGeneration(); 