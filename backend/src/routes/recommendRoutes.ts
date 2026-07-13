import { Router } from 'express';
import { getRecommendations, getStatus } from '../controllers/recommendController';

const router = Router();

router.post('/', getRecommendations);
router.get('/status', getStatus);

export default router;
