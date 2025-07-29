const { wipeAllRecordsAndAssociations } = require('./src/functions/record-functions/wipe-all-records');
const { generateLeadsFromDummy } = require('./src/functions/record-functions/dummy-records');
const { wipeStreamRecordsOnly } = require('./src/functions/record-functions/wipe-stream-primes');
const { generateLeadsFromStream } = require('./src/functions/record-functions/stream-in');
const { resolveStreamStep } = require('./src/functions/record-functions/resolve-stream');
const { getDemoPayload } = require('./src/functions/record-functions/demo-payload');
const fs = require('fs/promises');
const path = require('path');

async function main() {
  const [,, command] = process.argv;
  if (!command) {
    console.error('Usage: node app.js <command>');
    console.error('Commands: reset, init, <step_number>');
    process.exit(1);
  }

  // Always use "stream" as the demo name for this focused app
  const demoName = 'stream';
  
  // Load configuration files
  const streamIdStorePath = path.resolve(__dirname, 'src/stream-id-store.json');
  const demoConfigPath = path.resolve(__dirname, 'src/demo-config.json');
  
  let streamIdStore, demoConfig;
  try {
    streamIdStore = JSON.parse(await fs.readFile(streamIdStorePath, 'utf-8'));
    demoConfig = JSON.parse(await fs.readFile(demoConfigPath, 'utf-8'));
  } catch (err) {
    console.error('Error loading configuration files:', err);
    process.exit(1);
  }

  try {
    switch (command) {
      case 'reset':
        console.log('=== Starting Reset Process ===');
        
        // Step 1: Wipe all records and associations
        console.log('Step 1: Wiping all records and associations...');
        await wipeAllRecordsAndAssociations();
        
        // Step 2: Generate dummy records
        console.log('Step 2: Generating dummy records...');
        await generateLeadsFromDummy(demoConfig, demoName);
        
        console.log('Reset Complete - Records wiped and dummy Records Generated');
        break;

      case 'init':
        console.log('=== Starting Init Process ===');
        
        // Step 1: Wipe stream records only (may or may not exist)
        console.log('Step 1: Wiping existing stream records...');
        await wipeStreamRecordsOnly();
        
        // Step 2: Generate stream records
        console.log('Step 2: Generating stream records...');
        await generateLeadsFromStream(demoName);
        
        // Step 3: Get demo payload
        console.log('Step 3: Getting demo payload...');
        const payload = await getDemoPayload(demoName);
        console.log('DEMO_PAYLOAD_JSON:' + JSON.stringify(payload));
        break;

      default:
        // Check if command is an integer (step number)
        const stepNumber = parseInt(command);
        if (!isNaN(stepNumber)) {
          console.log(`=== Starting Step ${stepNumber} Process ===`);
          
          // Parse extra input from process.argv (expecting JSON as 4th arg)
          let extraInput = {};
          if (process.argv[3]) {
            try {
              extraInput = JSON.parse(process.argv[3]);
            } catch (e) {
              console.error('Could not parse extra input JSON:', e);
            }
          }
          
          // Reload stream-id-store.json to get latest state
          const updatedStreamIdStore = JSON.parse(await fs.readFile(streamIdStorePath, 'utf-8'));
          
          // Run resolve stream step with phone number if provided
          await resolveStreamStep(demoConfig, updatedStreamIdStore, stepNumber, extraInput.phone);
          
          console.log(`Step ${stepNumber} Complete`);
        } else {
          throw new Error(`Unknown command: ${command}. Use 'reset', 'init', or a step number.`);
        }
        break;
    }
  } catch (error) {
    console.error('Error in app.js:', error.message);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error in app.js:', err);
  process.exit(1);
}); 