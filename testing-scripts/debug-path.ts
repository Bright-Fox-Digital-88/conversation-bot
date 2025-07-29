import * as path from 'path';
import * as fs from 'fs/promises';

async function debugPath() {
    console.log('=== Debugging Path Resolution ===');
    
    // Test the path construction from resolve-stream.ts
    const stepName = 'sally-scanner';
    const stepPath = path.resolve(__dirname, '../src/prime', 'stream', `${stepName}.json`);
    
    console.log('Step name:', stepName);
    console.log('Constructed path:', stepPath);
    console.log('File exists:', await fs.access(stepPath).then(() => 'YES').catch(() => 'NO'));
    
    // Try to read the file
    try {
        const fileContent = await fs.readFile(stepPath, 'utf-8');
        const records = JSON.parse(fileContent);
        console.log('File content type:', Array.isArray(records) ? 'Array' : typeof records);
        console.log('Array length:', Array.isArray(records) ? records.length : 'N/A');
        console.log('First record:', Array.isArray(records) && records.length > 0 ? records[0] : 'N/A');
    } catch (error) {
        console.error('Error reading file:', error);
    }
}

debugPath()
    .then(() => {
        console.log('Debug completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Debug failed:', error);
        process.exit(1);
    }); 