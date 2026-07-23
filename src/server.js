import dotenv from 'dotenv';
import dns from 'node:dns';

// Loads .env during local development.
// On Render, variables are already available through process.env.
dotenv.config({ quiet: true });

dns.setDefaultResultOrder('ipv4first');

const port = Number(process.env.PORT) || 5000;
const jwtSecret = process.env.JWT_SECRET?.trim();
const mongoUri = process.env.MONGODB_URI?.trim();

if (!jwtSecret || jwtSecret.length < 32) {
  console.error(
    'JWT_SECRET must be configured and contain at least 32 characters.'
  );
  process.exit(1);
}

if (!mongoUri) {
  console.error('MONGODB_URI must be configured.');
  process.exit(1);
}

// Import application modules after environment variables are loaded.
const { default: app } = await import('./app.js');
const { connectDatabase, disconnectDatabase } = await import(
  './config/db.js'
);

let server;

try {
  await connectDatabase();

  server = app.listen(port, '0.0.0.0', () => {
    console.log(`TaskFlow API running on port ${port}`);
  });
} catch (error) {
  console.error('Failed to start TaskFlow API:', error.message);
  process.exit(1);
}

async function shutdown(signal) {
  console.log(`${signal} received. Closing server...`);

  if (!server) {
    await disconnectDatabase();
    process.exit(0);
  }

  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));