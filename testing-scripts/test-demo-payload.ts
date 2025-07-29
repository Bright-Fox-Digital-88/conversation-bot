import { getDemoPayload } from '../src/functions/record-functions/demo-payload';

(async () => {
    const demoName = 'sally-scanner';
    console.log(`Loading demo payload for ${demoName}...`);
    try {
        const payload = await getDemoPayload(demoName);
        console.log('Demo payload:', payload);
    } catch (err) {
        console.error('Error loading demo payload:', err);
    }
})(); 