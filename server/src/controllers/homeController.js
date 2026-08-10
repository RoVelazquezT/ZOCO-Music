import { getArtistById, searchArtistsByGenre } from '../services/spotifyApi.js';
import { curatedArtists } from '../config/curatedArtists.js';

const HOME_GENRES = ['pop', 'rock'];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getHome(req, res, next) {
  try {
    const curated = [];
    for (const artist of curatedArtists) {
      curated.push(await getArtistById(artist.id));
      await delay(120);
    }

    const byGenre = [];
    for (const genre of HOME_GENRES) {
      const result = await searchArtistsByGenre(genre);
      byGenre.push({ genre, artists: result.artists?.items ?? [] });
      await delay(120);
    }

    res.json({ curated, byGenre });
  } catch (error) {
    next(error);
  }
}