import { generateLeadsFromPrime } from '../src/functions/record-functions/prime-in';

(async () => {
    console.log('Starting generateLeadsFromPrime for sally-scanner...');
    try {
        await generateLeadsFromPrime('sally-scanner');
        console.log('generateLeadsFromPrime completed successfully.');
    } catch (err) {
        console.error('Error during generateLeadsFromPrime:', err);
    }
})(); 