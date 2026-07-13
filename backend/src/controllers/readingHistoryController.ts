import type { Request, Response } from 'express';
import ReadingHistory from '../models/ReadingHistory';
import Book from '../models/Book';

export const trackView = async (req: Request, res: Response): Promise<void> => {
  const { bookId } = req.body;

  if (!bookId) {
    res.status(400).json({ error: 'bookId is required' });
    return;
  }

  if (!req.user) {
    res.status(200).json({}); 
    return;
  }

  try {
    
    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }

    await ReadingHistory.create({
      userId: req.user.userId,
      bookId,
      viewedAt: new Date(),
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to track view' });
  }
};

export const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const history = await ReadingHistory.find({ userId: req.user?.userId })
      .populate('bookId')
      .sort({ viewedAt: -1 })
      .limit(50);
      
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reading history' });
  }
};
