import { Router } from 'express';
import { searchHandler } from '../controllers/searchController.js';
import { getArtist } from '../controllers/artistController.js';
import { getAlbum } from '../controllers/albumController.js';

const router = Router();

router.get('/search', searchHandler);
router.get('/artists/:id', getArtist);
router.get('/albums/:id', getAlbum);

export default router;
