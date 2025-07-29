import { resolvePrimeStep } from '../src/functions/record-functions/prime-resolve-a';
import * as fs from 'fs/promises';
import * as path from 'path';

(async () => {
    const demoName = 'sally-scanner';
    console.log(`Starting resolvePrimeStep for ${demoName}...`);
    try {
        const configPath = path.resolve(__dirname, '../src/demo-config.json');
        const idStorePath = path.resolve(__dirname, '../src/id-store.json');
        const configContent = await fs.readFile(configPath, 'utf-8');
        const idStoreContent = await fs.readFile(idStorePath, 'utf-8');
        const demoConfig = JSON.parse(configContent);
        const idStore = JSON.parse(idStoreContent);
        await resolvePrimeStep(demoConfig, idStore, demoName);
        console.log('resolvePrimeStep completed successfully.');
    } catch (err) {
        console.error('Error during resolvePrimeStep:', err);
    }
})(); 