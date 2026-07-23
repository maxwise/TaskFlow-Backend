import dotenv from 'dotenv';
import dns from 'node:dns';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve the backend root directory.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load TaskFlow-Backend/.env
const envPath = path.resolve(__dirname, '../.env');
const envResult = dotenv.config({ path: envPath });

if (envResult.error) {
  console.error(`Unable to load environment file from: ${envPath}`);
  console.error(envResult.error.message);
  process.exit(1);
}

// Prefer IPv4 and use Google DNS for Node DNS requests.
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const port = Number(process.env.PORT) || 5000;
const jwtSecret = process.env.JWT_SECRET?.trim();

if (!jwtSecret || jwtSecret.length < 32) {
  console.error(
    'JWT_SECRET must be present in the root .env file and contain at least 32 characters.'
  );
  console.error(`Expected environment file: ${envPath}`);
  process.exit(1);
}

if (!process.env.MONGODB_URI?.trim()) {
  console.error('MONGODB_URI must be present in the root .env file.');
  process.exit(1);
}

// Import these only after dotenv has loaded.
const { default: app } = await import('./app.js');
const { connectDatabase, disconnectDatabase } = await import(
  './config/db.js'
);

let server;

try {
  await connectDatabase();

  server = app.listen(port, () => {
    console.log(`TaskFlow API running on http://localhost:${port}`);
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