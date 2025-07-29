# WebSocket Server Setup: Why and How We Used `.cjs`

## Overview
This document explains the process and reasoning behind setting up a Node.js WebSocket server using a `.cjs` file extension, instead of TypeScript or `.js` with ES modules. It is intended to help future developers (or AIs) understand the technical decisions and steps required to get a working WebSocket backend in a mixed TypeScript/JavaScript project.

---

## The Problem

- We wanted to run a simple WebSocket server for local development, using the `ws` library.
- The rest of the project uses TypeScript (TS), but we wanted the server to "just work" without TypeScript/ESM loader headaches.
- Node.js, TypeScript, and ES module (ESM) support can be tricky to configure, especially when mixing `import`/`export` (ESM) and `require`/`module.exports` (CommonJS).
- Our project had `"type": "module"` in `package.json` to support ESM elsewhere, which affects how Node treats `.js` files.

---

## What Didn't Work

1. **TypeScript (`.ts`) with `ts-node`**
   - Using `import { WebSocketServer } from 'ws'` in a `.ts` file requires Node to treat the file as an ES module.
   - Running with `npx ts-node ws-server.ts` failed unless extra loader flags were used, and even then, compatibility was fragile.
   - TypeScript strictness and module system mismatches caused repeated errors.

2. **JavaScript (`.js`) with CommonJS (`require`)**
   - With `"type": "module"` in `package.json`, Node treats `.js` files as ESM by default.
   - Using `require('ws')` in a `.js` file caused errors: `ReferenceError: require is not defined in ES module scope`.

3. **JavaScript (`.js`) with ESM (`import`)**
   - Using `import { WebSocketServer } from 'ws'` in a `.js` file required ESM syntax everywhere, and sometimes conflicted with other tooling or dependencies.

---

## The Solution: Use `.cjs` for the Server

- **`.cjs` files are always treated as CommonJS modules by Node.js**, regardless of the `"type"` field in `package.json`.
- This means you can use `require()` and `module.exports` without worrying about ESM/TypeScript loader issues.
- The `ws` library works perfectly with CommonJS syntax.
- This approach is robust, simple, and avoids all the headaches of configuring ESM/TS loaders for a small backend script.

### Example: `ws-server.cjs`
```js
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
      await new Promise(r => setTimeout(r, 1000));
      ws.send(JSON.stringify({ type: 'intermediate', payload: { step: 'Path resolved' } }));
    }

    if (data.type === 'continue') {
      console.log('Received continue signal');
      await new Promise(r => setTimeout(r, 1000));
      ws.send(JSON.stringify({ type: 'final', payload: { result: 'Operation complete 🎉' } }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
```

---

## Step-by-Step: How to Set Up

1. **Create the server file as `ws-server.cjs`**
   - Use CommonJS syntax: `const { WebSocketServer } = require('ws');`
2. **Run the server with Node.js**
   - Command: `node ws-server.cjs`
   - You will see logs in the terminal for server start, client connections, messages, and disconnects.
3. **No need for TypeScript or ESM loaders for this file**
   - The rest of your project can still use TypeScript and/or ESM as needed.
   - This file is isolated and robust.

---

## Why This Works

- Node.js always treats `.cjs` files as CommonJS, so you avoid all ambiguity about module systems.
- You can use `require()` and all Node.js APIs as expected.
- This approach is especially useful in projects where you want to avoid complex build or loader setups for simple backend scripts.
- It is compatible with any frontend (TypeScript, React, etc.) that connects via WebSocket.

---

## Summary

- `.cjs` is the most reliable way to run a simple Node.js WebSocket server in a mixed or modern JS/TS project.
- It avoids ESM/CommonJS/TypeScript loader issues.
- The rest of your project can use TypeScript and ESM as needed.
- This pattern is robust, easy to maintain, and easy to explain to new developers or AIs. 