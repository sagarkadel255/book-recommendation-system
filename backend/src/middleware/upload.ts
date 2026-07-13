import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AUTH_CONFIG } from '../config/auth';

const uploadDir = path.resolve(__dirname, '../../', AUTH_CONFIG.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  }
};

export const avatarUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: AUTH_CONFIG.MAX_FILE_SIZE },
});
