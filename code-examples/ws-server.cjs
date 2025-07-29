const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

console.log('WebSocket server started on ws://localhost:8080');

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    console.log('Received message:', message.toString());
    const data = JSON.parse(message.toString());

    if (data.type === 'start') {
      console.log('Received start signal');
      // Simulate work
      await new Promise(r => setTimeout(r, 1000));
      ws.send(JSON.stringify({ type: 'intermediate', payload: { step: 'Path resolved' } }));
    }

    if (data.type === 'continue') {
      console.log('Received continue signal');
      // Simulate more work
      await new Promise(r => setTimeout(r, 1000));
      ws.send(JSON.stringify({ type: 'final', payload: { result: 'Operation complete 🎉' } }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
}); 