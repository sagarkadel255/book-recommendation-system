import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import bookRoutes from './routes/bookRoutes';
import recommendRoutes from './routes/recommendRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import ratingRoutes from './routes/ratingRoutes';
import favoriteRoutes from './routes/favoriteRoutes';
import readingHistoryRoutes from './routes/readingHistoryRoutes';
import { apiLimiter, recommendLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use('/api', apiLimiter);

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/history', readingHistoryRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/recommend', recommendLimiter, recommendRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
