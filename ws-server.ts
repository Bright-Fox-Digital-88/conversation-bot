import { WebSocketServer, WebSocket } from 'ws';
import { spawn } from 'child_process';
import express from 'express';
import twilioRoutes from './src/routes/twilio.routes';

const PORT = parseInt(process.env.PORT || '8080', 10);
const app = express();

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Import and use Twilio routes
app.use('/', twilioRoutes);

// Health check endpoints for Railway
app.get('/health', (req, res) => {
  console.log('[HTTP] Health check requested');
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: PORT
  });
});

// Root endpoint for Railway
app.get('/', (req, res) => {
  console.log('[HTTP] Root endpoint requested');
  res.status(200).json({ 
    message: 'Lendex CRM Demo Server',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      twilio: '/twilio',
      demo: '/demo/trigger'
    }
  });
});

// Demo trigger endpoint
app.post('/demo/trigger', (req, res) => {
  console.log('[HTTP] Demo trigger received');
  // You can add demo trigger logic here
  return res.status(200).json({ status: 'Demo trigger received' });
});

// Create HTTP server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 HTTP server started on http://0.0.0.0:${PORT}`);
  console.log(`📞 Twilio webhook endpoint: http://0.0.0.0:${PORT}/twilio`);
  console.log(`🏥 Health check endpoint: http://0.0.0.0:${PORT}/health`);
  console.log(`✅ Server is ready to accept connections`);
});

// Create WebSocket server attached to the HTTP server
const wss = new WebSocketServer({ server });
console.log(`🔌 WebSocket server attached to HTTP server on ws://0.0.0.0:${PORT}`);

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  let initialized = false;

  ws.on('ping', () => {
    console.log('Received ping from client');
    ws.pong();
  });

  ws.on('message', async (message: Buffer) => {
    let data: any;
    try {
      data = JSON.parse(message.toString());
    } catch (e) {
      ws.send(JSON.stringify({ type: 'error', error: 'Invalid JSON' }));
      return;
    }

    // ✅ New: Handle test input for Twilio message logic
    if (data.type === 'twilio' && typeof data.message === 'string') {
      console.log('[WS] Received Twilio test message:', data.message);
      try {
        // Spawn dedicated Twilio handler process for state management with path resolution
        const child = spawn('npx', ['ts-node', '-r', 'tsconfig-paths/register', 'src/services/twilio/twilio-handler.ts', data.message]);
        
        child.on('close', (code) => {
          if (code === 0) {
            ws.send(JSON.stringify({ type: 'twilioAck', message: 'Twilio logic executed.' }));
          } else {
            ws.send(JSON.stringify({ type: 'error', message: 'Twilio message failed' }));
          }
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        ws.send(JSON.stringify({ type: 'error', message: 'Twilio message failed: ' + errorMessage }));
      }
      return;
    }

    // 👇 Existing logic below
    function runCommand(command: string | string[]): Promise<any> {
      return new Promise((resolve, reject) => {
        // Use 'ts-node' for app.ts since it's now TypeScript
        const cmd = Array.isArray(command) ? command : ['ts-node', 'app.ts', command];
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
              resolve(undefined);
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
        ws.send(JSON.stringify({ type: 'status', message: 'Initializing stream records...' }));
        const demoPayload = await runCommand('init');

        ws.send(JSON.stringify({ type: 'demoPayload', payload: demoPayload }));
        ws.send(JSON.stringify({ type: 'status', message: 'Stream workflow initialized. Awaiting step commands.' }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        ws.send(JSON.stringify({ type: 'error', message: errorMessage }));
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
        let cmd = ['ts-node', 'app.ts', stepNumber.toString()];
        if (data.phone && data.phone.trim()) {
          const phoneJson = JSON.stringify({ phone: data.phone.trim() });
          cmd.push(phoneJson);
        }

        await runCommand(cmd);
        ws.send(JSON.stringify({
          type: 'stepComplete',
          stepNumber,
          message: `Step ${stepNumber} Complete`
        }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        ws.send(JSON.stringify({
          type: 'stepError',
          stepNumber,
          message: errorMessage
        }));
        console.error(`[WS] Error during step ${stepNumber}: ${err}`);
      }
    }

    // Legacy proceed (step 0)
    if (data.type === 'proceed' && initialized) {
      ws.send(JSON.stringify({ type: 'status', message: 'Processing step 0...' }));

      try {
        await runCommand('0');
        ws.send(JSON.stringify({ type: 'demoComplete', message: 'Demo Complete' }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        ws.send(JSON.stringify({ type: 'error', message: errorMessage }));
        console.error(`[WS] Error during proceed: ${err}`);
      }
    }

    // Reset
    if (data.type === 'reset') {
      ws.send(JSON.stringify({ type: 'status', message: 'Resetting environment...' }));

      try {
        await runCommand('reset');
        ws.send(JSON.stringify({ type: 'resetComplete', message: 'Reset Complete - Records wiped and dummy Records Generated' }));
        initialized = false;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        ws.send(JSON.stringify({ type: 'error', message: errorMessage }));
        console.error(`[WS] Error during reset: ${err}`);
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
}); 