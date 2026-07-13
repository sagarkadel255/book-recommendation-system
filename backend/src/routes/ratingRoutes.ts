import { Router } from 'express';
import { addOrUpdateRating, getUserRatings } from '../controllers/ratingController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.post('/', requireAuth, addOrUpdateRating);
router.get('/', requireAuth, getUserRatings);

export default router;
