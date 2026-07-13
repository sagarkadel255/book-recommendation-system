import { Router } from 'express';
import { toggleFavorite, getFavorites } from '../controllers/favoriteController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.post('/toggle', requireAuth, toggleFavorite);
router.get('/', requireAuth, getFavorites);

export default router;
