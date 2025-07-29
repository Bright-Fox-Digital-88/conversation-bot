const { WebSocketServer } = require('ws');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT, host: '0.0.0.0' });
console.log(`WebSocket server started on ws://0.0.0.0:${PORT}`);

wss.on('connection', (ws) => {
  console.log('Client connected');

  let demoName = null;
  let initialized = false;

  ws.on('message', async (message) => {
    let data;
    try {
      data = JSON.parse(message.toString());
    } catch (e) {
      ws.send(JSON.stringify({ type: 'error', error: 'Invalid JSON' }));
      return;
    }

    // Initialization flow
    if (data.type === 'initialize' && data.demoName && !initialized) {
      demoName = data.demoName;
      initialized = true;
      ws.send(JSON.stringify({ type: 'status', message: 'Initializing demo...' }));

      // Helper to run a stage and stream logs/errors
      function runStage(stage, ...args) {
        return new Promise((resolve, reject) => {
          const cmd = ['ts-node', 'app.js', stage, demoName, ...args];
          console.log(`[WS] Starting stage: ${stage} | Command: npx ${cmd.join(' ')}`);
          const child = spawn('npx', cmd);
          child.stdout.on('data', (chunk) => {
            process.stdout.write(`[${stage} stdout] ${chunk}`);
            ws.send(JSON.stringify({ type: 'log', message: chunk.toString() }));
          });
          child.stderr.on('data', (chunk) => {
            process.stderr.write(`[${stage} stderr] ${chunk}`);
            ws.send(JSON.stringify({ type: 'error', message: chunk.toString() }));
          });
          let output = '';
          if (stage === 'demo-payload') {
            child.stdout.on('data', (chunk) => { output += chunk.toString(); });
          }
          child.on('close', (code) => {
            console.log(`[WS] Stage ${stage} exited with code ${code}`);
            if (code === 0) {
              if (stage === 'demo-payload') {
                try {
                  // Split output into lines and find the line with the DEMO_PAYLOAD_JSON prefix
                  const lines = output.split('\n');
                  const jsonLine = lines.find(line => line.trim().startsWith('DEMO_PAYLOAD_JSON:'));
                  if (!jsonLine) throw new Error('No JSON line found in demo-payload output');
                  const payload = JSON.parse(jsonLine.trim().replace('DEMO_PAYLOAD_JSON:', ''));
                  resolve(payload);
                } catch (e) {
                  reject(`[WS] Failed to parse demo payload: ${e}`);
                }
              } else {
                resolve();
              }
            } else {
              reject(`[WS] Stage ${stage} failed with code ${code}`);
            }
          });
        });
      }

      try {
        await runStage('wipe');
        await runStage('dummy');
        await runStage('prime-in');
        const demoPayload = await runStage('demo-payload');
        ws.send(JSON.stringify({ type: 'demoPayload', payload: demoPayload }));
        ws.send(JSON.stringify({ type: 'status', message: 'Demo initialized. Awaiting proceed.' }));
      } catch (err) {
        ws.send(JSON.stringify({ type: 'error', message: err.toString() }));
        console.error(`[WS] Error during initialization: ${err}`);
        return;
      }
    }

    // Proceed flow
    if (data.type === 'proceed' && initialized && demoName) {
      ws.send(JSON.stringify({ type: 'status', message: 'Processing step...' }));
      // Only fire step 0 for this demo
      function runStage(stage, ...args) {
        return new Promise((resolve, reject) => {
          const cmd = ['ts-node', 'app.js', stage, demoName, ...args];
          console.log(`[WS] Starting stage: ${stage} | Command: npx ${cmd.join(' ')}`);
          const child = spawn('npx', cmd);
          child.stdout.on('data', (chunk) => {
            process.stdout.write(`[${stage} stdout] ${chunk}`);
            ws.send(JSON.stringify({ type: 'log', message: chunk.toString() }));
          });
          child.stderr.on('data', (chunk) => {
            process.stderr.write(`[${stage} stderr] ${chunk}`);
            ws.send(JSON.stringify({ type: 'error', message: chunk.toString() }));
          });
          child.on('close', (code) => {
            console.log(`[WS] Stage ${stage} exited with code ${code}`);
            if (code === 0) resolve();
            else reject(`[WS] Stage ${stage} failed with code ${code}`);
          });
        });
      }
      try {
        await runStage('resolve-step', '0');
        ws.send(JSON.stringify({ type: 'demoComplete', message: 'Demo Complete' }));
      } catch (err) {
        ws.send(JSON.stringify({ type: 'error', message: err.toString() }));
        console.error(`[WS] Error during proceed: ${err}`);
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
}); 