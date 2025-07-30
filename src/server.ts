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