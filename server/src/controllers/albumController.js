import { getAlbumById } from '../services/spotifyApi.js';

export async function getAlbum(req, res, next) {
  try {
    const { id } = req.params;
    const album = await getAlbumById(id);
    res.json(album);
  } catch (error) {
    next(error);
  }
}
