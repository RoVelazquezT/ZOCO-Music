import { getAccessToken } from './spotifyAuth.js';

const BASE_URL = 'https://api.spotify.com/v1';

async function spotifyFetch(path) {
  const token = await getAccessToken();
  
  console.log('URL final enviada a Spotify:', `${BASE_URL}${path}`); // ← temporal, para diagnosticar

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    const error = new Error('No se pudo conectar con Spotify');
    error.status = 503;
    throw error;
  }

  if (!response.ok) {
    let message = `Error de Spotify: ${response.status}`;
    try {
      const body = await response.json();
      message = body?.error?.message || message;
    } catch {
      // el body no era JSON, se usa el mensaje genérico
    }

    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export function search(query, types = ['artist', 'track', 'album'], limit = 20) {
  const params = new URLSearchParams({ 
    q: query, 
    type: types.join(',')
  });
  const parsedLimit = parseInt(limit, 10);
  if (!isNaN(parsedLimit) && parsedLimit !== 20) {
    params.append('limit', parsedLimit);
  }
  const urlFinal = `/search?${params.toString()}`;
  // Imprimimos en tu terminal local para auditar que la URL esté perfecta
  console.log('🔍 URL limpia enviada a Spotify:', urlFinal);
  return spotifyFetch(urlFinal);
}

export function getArtistById(id) {
  return spotifyFetch(`/artists/${id}`);
}

export function getArtistAlbums(id) {
  return spotifyFetch(`/artists/${id}/albums`);
}

export function getAlbumById(id) {
  return spotifyFetch(`/albums/${id}`);
}
