# TaskFlow Backend

This is the standalone Node.js, Express.js, MongoDB, and JWT backend for the TaskFlow MERN application.

## Local setup

1. Install Node.js 24 LTS.
2. Open a terminal in this folder.
3. Copy `.env.example` to `.env`.
4. Configure `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=YOUR_MONGODB_ATLAS_URI
JWT_SECRET=YOUR_SECRET_OF_AT_LEAST_32_CHARACTERS
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

5. Install and start:

```bash
npm install
npm run dev
```

Test the API at `http://localhost:5000/api/health`.

## Render deployment

Upload this folder to its own GitHub repository. In Render, create a Blueprint from the repository using `render.yaml`, or create a Web Service with:

```text
Build command: npm install
Start command: npm start
Health check: /api/health
```

Set `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `CLIENT_URL` in Render's environment settings. Set `CLIENT_URL` to the deployed Vercel frontend URL.
