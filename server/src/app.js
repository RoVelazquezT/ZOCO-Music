import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { getAccessToken } from './services/spotifyAuth.js';

const app = express();

app.use(cors({ origin: env.clientUrl }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Ruta temporal, solo para verificar que el token funciona.
// La vamos a borrar en el próximo paso cuando tengamos el endpoint real de búsqueda.
app.get('/api/spotify-test', async (req, res) => {
  try {
    const token = await getAccessToken();
    res.json({ tokenPreview: token.slice(0, 10) + '...' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default app;