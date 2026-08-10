import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
};


if (!env.spotifyClientId || !env.spotifyClientSecret) {
  console.error('Faltan las variables SPOTIFY_CLIENT_ID o SPOTIFY_CLIENT_SECRET en el .env');
  process.exit(1);
}