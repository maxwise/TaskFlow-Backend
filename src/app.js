import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

const normalizeOrigin = (value = '') => value.trim().replace(/\/$/, '');
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(normalizeOrigin)
  .filter(Boolean);

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(
  cors({
    credentials: false,
    origin(origin, callback) {
      // Requests without an Origin header include health checks and server-to-server calls.
      if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
        callback(null, true);
        return;
      }

      const error = new Error('This origin is not allowed by the TaskFlow API.');
      error.status = 403;
      callback(error);
    },
  }),
);
app.use(express.json({ limit: '100kb' }));

app.get('/', (_req, res) => {
  res.json({
    service: 'TaskFlow API',
    status: 'online',
    health: '/api/health',
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'TaskFlow API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
