import express from 'express';
import http from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './src/server/routes.js';
import { initWebSocketServer } from './src/server/websocket.js';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const server = http.createServer(app);

  app.use(express.json());

  // API routes FIRST
  app.use('/api', apiRouter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Care Health Nurses Home Healthcare API' });
  });

  // Initialize WebSocket server attached to HTTP server
  initWebSocketServer(server);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
