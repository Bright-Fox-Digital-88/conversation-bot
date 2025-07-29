import * as express from 'express';

console.log('Express imported successfully:', typeof express);
console.log('Express Router:', typeof express.Router);

// Test if we can import from controllers
try {
  const { handleDemoTrigger } = require('@controllers/demo.controller');
  console.log('Demo controller imported successfully:', typeof handleDemoTrigger);
} catch (error: any) {
  console.error('Failed to import demo controller:', error.message);
} 