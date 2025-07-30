import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(cors());

// Custom request logging middleware - logs ALL requests
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const port = process.env.PORT || 3000;
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  
  console.log(`\n🚀 [${timestamp}] REQUEST RECEIVED:`);
  console.log(`📍 Port: ${port}`);
  console.log(`🌐 URL: ${fullUrl}`);
  console.log(`📝 Method: ${req.method}`);
  console.log(`🔗 Path: ${req.path}`);
  console.log(`📊 Query:`, req.query);
  console.log(`📋 Headers:`, req.headers);
  console.log(`📦 Body:`, req.body);
  console.log(`👤 IP: ${req.ip || req.connection.remoteAddress}`);
  console.log(`🔍 User Agent: ${req.get('User-Agent')}`);
  console.log(`─`.repeat(80));
  
  next();
});

// Morgan logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Production-only middleware
if (process.env.NODE_ENV === 'production') {
  // Add production-specific middleware here if needed
  // Example: helmet, compression, rate limiting
}

// Mount all routes under /api
app.use('/api', routes);

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', err);
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server'
  });
});

export default app; 