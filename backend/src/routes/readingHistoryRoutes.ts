import { Router } from 'express';
import { trackView, getHistory } from '../controllers/readingHistoryController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.post('/track', trackView); 
router.get('/', requireAuth, getHistory);

export default router;
