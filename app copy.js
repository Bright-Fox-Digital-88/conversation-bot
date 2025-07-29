const { wipeAllRecordsAndAssociations } = require('./src/functions/record-functions/wipe-records');
const { generateLeadsFromDummy } = require('./src/functions/record-functions/dummy-records');
const { generateLeadsFromPrime } = require('./src/functions/record-functions/prime-in');
const { resolvePrimeStep } = require('./src/functions/record-functions/prime-resolve-a');
const { getDemoPayload } = require('./src/functions/record-functions/demo-payload');
const fs = require('fs/promises');
const path = require('path');

async function main() {
  const [,, stage, demoName, stepIndex] = process.argv;
  if (!stage || !demoName) {
    console.error('Usage: node app.js <stage> <demoName> [stepIndex]');
    process.exit(1);
  }

  // Load config if needed
  const idStorePath = path.resolve(__dirname, 'src/id-store.json');
  const demoConfigPath = path.resolve(__dirname, 'src/demo-config.json');
  let idStore, demoConfig;
  if (["dummy", "prime-in", "resolve-step"].includes(stage)) {
    idStore = JSON.parse(await fs.readFile(idStorePath, 'utf-8'));
    demoConfig = JSON.parse(await fs.readFile(demoConfigPath, 'utf-8'));
  }

  switch (stage) {
    case 'wipe':
      await wipeAllRecordsAndAssociations();
      break;
    case 'dummy':
      await generateLeadsFromDummy(demoConfig, demoName);
      break;
    case 'prime-in':
      await generateLeadsFromPrime(demoName);
      break;
    case 'demo-payload':
      const payload = await getDemoPayload(demoName);
      console.log('DEMO_PAYLOAD_JSON:' + JSON.stringify(payload));
      break;
    case 'resolve-step':
      if (stepIndex === undefined) throw new Error('Missing stepIndex');
      await resolvePrimeStep(demoConfig, idStore, demoName, Number(stepIndex));
      break;
    default:
      throw new Error('Unknown stage: ' + stage);
  }
}

main().catch(err => {
  console.error('Error in app.js:', err);
  process.exit(1);
}); 