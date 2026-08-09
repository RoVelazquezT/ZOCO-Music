import { search } from '../services/spotifyApi.js';

export async function searchHandler(req, res, next) {
  try {
    const { q, type, limit } = req.query;

    if (!q) {
      const error = new Error('El parámetro "q" es obligatorio');
      error.status = 400;
      throw error;
    }

    const types = type ? type.split(',') : ['artist', 'track', 'album'];
    const data = await search(q, types, limit);
    res.json(data);
  } catch (error) {
    next(error);
  }
}
