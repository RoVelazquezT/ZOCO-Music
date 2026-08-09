import { Router } from 'express';
import { searchHandler } from '../controllers/searchController.js';
import { getArtist } from '../controllers/artistController.js';
import { getAlbum } from '../controllers/albumController.js';
import { getHome } from '../controllers/homeController.js';

const router = Router();

router.get('/home', getHome);
router.get('/search', searchHandler);
router.get('/artists/:id', getArtist);
router.get('/albums/:id', getAlbum);

export default router;
