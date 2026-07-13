import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import Rating from '../models/Rating';
import Book from '../models/Book';

export const addOrUpdateRating = async (req: Request, res: Response): Promise<void> => {
  const { bookId, rating } = req.body;

  if (!bookId || !rating || rating < 1 || rating > 5) {
    res.status(400).json({ error: 'Valid bookId (isbn or mongoid) and rating (1-5) are required' });
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

    const existingRating = await Rating.findOne({ userId: req.user?.userId, bookId: book._id });

    let savedRating;
    if (existingRating) {
      existingRating.rating = rating;
      savedRating = await existingRating.save();
    } else {
      savedRating = await Rating.create({
        userId: req.user?.userId,
        bookId: book._id,
        rating,
      });
    }

    res.status(200).json(savedRating);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process rating' });
  }
};

export const getUserRatings = async (req: Request, res: Response): Promise<void> => {
  try {
    const ratings = await Rating.find({ userId: req.user?.userId }).populate('bookId');
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
};
