import { generateLead } from '../src/functions/crm-functions/lead-functions';
import { generateNotes } from '../src/functions/crm-functions/note-functions';
import sampleData from '../src/prime/sally-scanner/out.json';

async function testNoteGeneration() {
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

        // Now create notes for the lead
        console.log('\n🔍 Creating notes for the lead...');
        const noteResult = await generateNotes(leadResult.recordId, sampleData[0].Notes);

        if (noteResult.success && noteResult.noteIds) {
            console.log('✅ Notes created successfully!');
            console.log('📝 Note IDs:', noteResult.noteIds);
        } else {
            console.error('❌ Failed to create notes:', noteResult.error?.message);
        }

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the test
testNoteGeneration(); 