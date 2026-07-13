import { Router } from 'express';
import { updateAvatar, updateProfile } from '../controllers/userController';
import { requireAuth } from '../middleware/requireAuth';
import { avatarUpload } from '../middleware/upload';

const router = Router();

router.put('/profile', requireAuth, updateProfile);
router.post('/avatar', requireAuth, avatarUpload.single('avatar'), updateAvatar);

export default router;
