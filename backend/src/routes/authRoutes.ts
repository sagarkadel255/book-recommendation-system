import { Router } from 'express';
import { register, login, refresh, logout, getMe } from '../controllers/authController';
import { requireAuth } from '../middleware/requireAuth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);

export default router;
