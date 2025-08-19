// FABRICATOR PREPEND — DO NOT REMOVE
// Timestamp: 2025-08-18T10:55:37Z
// Spec Version: 1.0
// Target File: /Users/gordonligon/Desktop/dev/conversation-bot/src/server.ts
//
// ------------------------------------------------------------------------
//
// STUB PAYLOAD (commented copy follows)
//
// // PATCH: bootstrap the daily clear scheduler.
// import { scheduleDailyClear } from '@scheduler/daily';
// // NOTE: ensure this import runs at startup
// scheduleDailyClear();
//
// NOTE: Existing file detected. The fabricator header and commented stub were prepended above.
// Original content begins below.
//
// PATCH: bootstrap the daily clear scheduler.
import { scheduleDailyClear } from '@scheduler/daily';
// NOTE: ensure this import runs at startup
scheduleDailyClear();

import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🎯 SERVER STARTED:`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 Server URL: http://localhost:${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📊 Request logging: ENABLED`);
  console.log(`─`.repeat(80));
  console.log(`✅ Server is ready to receive requests!\n`);
}); 