import { getArtistById, getArtistAlbums } from '../services/spotifyApi.js';

export async function getArtist(req, res, next) {
  try {
    const { id } = req.params;

    const [artist, albums] = await Promise.all([
      getArtistById(id),
      getArtistAlbums(id),
    ]);

    res.json({ artist, albums });
  } catch (error) {
    next(error);
  }
}
