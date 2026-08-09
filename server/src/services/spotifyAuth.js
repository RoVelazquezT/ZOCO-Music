import { env } from '../config/env.js';

const TOKEN_URL = 'https://accounts.spotify.com/api/token';

let cachedToken = null;
let tokenExpiresAt = 0;

async function requestNewToken() {
  const credentials = Buffer.from(
    `${env.spotifyClientId}:${env.spotifyClientSecret}`
  ).toString('base64');

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Error al obtener token de Spotify: ${response.status} ${errorBody}`);
  }

  return response.json();
}

export async function getAccessToken() {
  const now = Date.now();

  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const data = await requestNewToken();

  cachedToken = data.access_token;
  // margen de 60s de seguridad antes de que venza realmente
  tokenExpiresAt = now + (data.expires_in - 60) * 1000;

  return cachedToken;
}