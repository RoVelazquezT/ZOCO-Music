import { getArtistById, searchArtistsByGenre } from '../services/spotifyApi.js';
import { curatedArtists } from '../config/curatedArtists.js';

const HOME_GENRES = ['pop', 'rock'];

export async function getHome(req, res, next) {
  try {
    const [curated, byGenre] = await Promise.all([
      Promise.all(curatedArtists.map((artist) => getArtistById(artist.id))),
      Promise.all(
        HOME_GENRES.map(async (genre) => {
          const result = await searchArtistsByGenre(genre);
          return { genre, artists: result.artists?.items ?? [] };
        })
      ),
    ]);

    res.json({ curated, byGenre });
  } catch (error) {
    next(error);
  }
}