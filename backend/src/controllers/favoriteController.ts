import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import Favorite from '../models/Favorite';
import Book from '../models/Book';

export const toggleFavorite = async (req: Request, res: Response): Promise<void> => {
  const { bookId } = req.body;

  if (!bookId) {
    res.status(400).json({ error: 'bookId is required' });
    return;
  }

  try {
    const isValidObjectId = Types.ObjectId.isValid(bookId);
    const book = isValidObjectId
      ? await Book.findById(bookId)
      : await Book.findOne({ isbn: bookId });

    if (!book) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }

    const existing = await Favorite.findOne({ userId: req.user?.userId, bookId: book._id });

    if (existing) {
      await existing.deleteOne();
      res.status(200).json({ message: 'Removed from favorites' });
    } else {
      await Favorite.create({ userId: req.user?.userId, bookId: book._id });
      res.status(201).json({ message: 'Added to favorites' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to process favorite' });
  }
};

export const getFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const favorites = await Favorite.find({ userId: req.user?.userId })
      .populate('bookId')
      .sort({ createdAt: -1 });
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};
