const { WebSocketServer } = require('ws');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT, host: '0.0.0.0' });
console.log(`WebSocket server started on ws://0.0.0.0:${PORT}`);

wss.on('connection', (ws) => {
  console.log('Client connected');

  let initialized = false;

  // Handle ping/pong for connection keep-alive
  ws.on('ping', () => {
    console.log('Received ping from client');
    ws.pong();
  });

  ws.on('message', async (message) => {
    let data;
    try {
      data = JSON.parse(message.toString());
    } catch (e) {
      ws.send(JSON.stringify({ type: 'error', error: 'Invalid JSON' }));
      return;
    }

    // Helper to run a command and stream logs/errors
    function runCommand(command) {
      return new Promise((resolve, reject) => {
        // Handle both string commands (legacy) and array commands (new)
        const cmd = Array.isArray(command) ? command : ['ts-node', 'app.js', command];
        console.log(`[WS] Starting command: ${Array.isArray(command) ? command.join(' ') : command} | Command: npx ${cmd.join(' ')}`);
        const child = spawn('npx', cmd, {
          env: { 
            ...process.env, 
            NPM_CONFIG_PRODUCTION: 'false',
            NPM_CONFIG_OMIT: 'dev'
          }
        });
        
        let output = '';
        
        child.stdout.on('data', (chunk) => {
          const chunkStr = chunk.toString();
          process.stdout.write(`[${command} stdout] ${chunkStr}`);
          ws.send(JSON.stringify({ type: 'log', message: chunkStr }));
          
          // Capture output for demo payload parsing
          if (command === 'init') {
            output += chunkStr;
          }
        });
        
        child.stderr.on('data', (chunk) => {
          const chunkStr = chunk.toString();
          process.stderr.write(`[${command} stderr] ${chunkStr}`);
          ws.send(JSON.stringify({ type: 'error', message: chunkStr }));
        });
        
        child.on('close', (code) => {
          const commandName = Array.isArray(command) ? command[2] : command;
          console.log(`[WS] Command ${commandName} exited with code ${code}`);
          if (code === 0) {
            if (commandName === 'init') {
              // Parse demo payload from output
              try {
                const lines = output.split('\n');
                const jsonLine = lines.find(line => line.trim().startsWith('DEMO_PAYLOAD_JSON:'));
                if (!jsonLine) throw new Error('No JSON line found in init output');
                const payload = JSON.parse(jsonLine.trim().replace('DEMO_PAYLOAD_JSON:', ''));
                resolve(payload);
              } catch (e) {
                reject(`[WS] Failed to parse demo payload: ${e}`);
              }
            } else {
              resolve();
            }
          } else {
            reject(`[WS] Command ${commandName} failed with code ${code}`);
          }
        });
      });
    }

    // Initialization flow
    if (data.type === 'init' && !initialized) {
      initialized = true;
      ws.send(JSON.stringify({ type: 'status', message: 'Initializing stream workflow...' }));

      try {
        // Init - setup stream workflow and get demo payload
        ws.send(JSON.stringify({ type: 'status', message: 'Initializing stream records...' }));
        const demoPayload = await runCommand('init');
        
        // Send demo payload to client
        ws.send(JSON.stringify({ type: 'demoPayload', payload: demoPayload }));
        ws.send(JSON.stringify({ type: 'status', message: 'Stream workflow initialized. Awaiting step commands.' }));
      } catch (err) {
        ws.send(JSON.stringify({ type: 'error', message: err.toString() }));
        console.error(`[WS] Error during init: ${err}`);
        initialized = false;
        return;
      }
    }

    // Step processing flow
    console.log(`[WS] Received step command: ${JSON.stringify(data)}, initialized: ${initialized}`);
    if (data.type === 'step' && initialized && typeof data.stepNumber === 'number') {
      const stepNumber = data.stepNumber;
      ws.send(JSON.stringify({ type: 'status', message: `Processing step ${stepNumber}...` }));
      
      try {
        // Build command with optional phone number
        let cmd = ['ts-node', 'app.js', stepNumber.toString()];
        
        // Add phone number as JSON if provided
        if (data.phone && data.phone.trim()) {
          const phoneJson = JSON.stringify({ phone: data.phone.trim() });
          cmd.push(phoneJson);
        }
        
        await runCommand(cmd);
        ws.send(JSON.stringify({ 
          type: 'stepComplete', 
          stepNumber: stepNumber,
          message: `Step ${stepNumber} Complete` 
        }));
      } catch (err) {
        ws.send(JSON.stringify({ 
          type: 'stepError', 
          stepNumber: stepNumber,
          message: err.toString() 
        }));
        console.error(`[WS] Error during step ${stepNumber}: ${err}`);
      }
    }

    // Legacy proceed flow (maps to step 0 for backward compatibility)
    if (data.type === 'proceed' && initialized) {
      ws.send(JSON.stringify({ type: 'status', message: 'Processing step 0...' }));
      
      try {
        await runCommand('0');
        ws.send(JSON.stringify({ type: 'demoComplete', message: 'Demo Complete' }));
      } catch (err) {
        ws.send(JSON.stringify({ type: 'error', message: err.toString() }));
        console.error(`[WS] Error during proceed: ${err}`);
      }
    }

    // Reset flow
    if (data.type === 'reset') {
      ws.send(JSON.stringify({ type: 'status', message: 'Resetting environment...' }));
      
      try {
        await runCommand('reset');
        ws.send(JSON.stringify({ type: 'resetComplete', message: 'Reset Complete - Records wiped and dummy Records Generated' }));
        initialized = false; // Allow re-initialization
      } catch (err) {
        ws.send(JSON.stringify({ type: 'error', message: err.toString() }));
        console.error(`[WS] Error during reset: ${err}`);
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
}); 