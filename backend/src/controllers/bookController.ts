import type { Request, Response } from 'express';
import Book from '../models/Book';
import { mapBookForFrontend } from '../utils/bookMapper';
import { GENRE_LIST } from '../utils/genreMapping';

export const listBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query['page'] as string) || 1;
    const limit = parseInt(req.query['limit'] as string) || 20;
    const search = req.query['search'] as string | undefined;
    const sort = req.query['sort'] as string | undefined;
    const genre = req.query['genre'] as string | undefined;
    const author = req.query['author'] as string | undefined;
    const minYear = req.query['minYear'] as string | undefined;
    const maxYear = req.query['maxYear'] as string | undefined;

    const conditions: Record<string, unknown>[] = [];

    if (search) {
      conditions.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { publisher: { $regex: search, $options: 'i' } },
        ],
      });
    }

    if (genre) {
      conditions.push({ genre });
    }

    if (author) {
      conditions.push({ author: { $regex: author, $options: 'i' } });
    }

    if (minYear || maxYear) {
      const yearFilter: Record<string, unknown> = {};
      if (minYear) yearFilter.$gte = minYear;
      if (maxYear) yearFilter.$lte = maxYear;
      conditions.push({ publicationYear: yearFilter });
    }

    let query: Record<string, unknown> = {};
    if (conditions.length > 0) {
      query = { $and: conditions };
    }

    let sortOption: Record<string, 1 | -1> = { totalRatings: -1 };
    if (sort === 'rating') {
      sortOption = { averageRating: -1 };
    } else if (sort === 'title') {
      sortOption = { title: 1 };
    } else if (sort === 'year') {
      sortOption = { publicationYear: -1 };
    }

    const skip = (page - 1) * limit;

    const books = await Book.find(query).sort(sortOption).skip(skip).limit(limit);
    const total = await Book.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({ books: books.map(mapBookForFrontend), total, page, totalPages });
  } catch (error) {
    console.error('[listBooks] Error:', error);
    res.status(500).json({ books: [], total: 0, page: 1, totalPages: 0, error: 'Failed to fetch books' });
  }
};

export const getBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const isbn = req.params['isbn'] as string;
    if (!isbn) {
      res.status(400).json({ error: 'ISBN is required' });
      return;
    }
    const book = await Book.findOne({ isbn });
    if (!book) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    res.json(mapBookForFrontend(book));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
};

export const getBookDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const title = req.query['title'] as string;
    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }
    const book = await Book.findOne({ title: { $regex: title, $options: 'i' } });
    if (!book) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    res.json(mapBookForFrontend(book));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
};

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = req.query['q'] as string;
    if (!q) {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }
    const limit = parseInt(req.query['limit'] as string) || 20;
    const results = await Book.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } },
      ],
    })
      .sort({ totalRatings: -1 })
      .limit(limit);
    res.json({ results: results.map(mapBookForFrontend), total: results.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search books' });
  }
};

export const popular = async (_req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(_req.query['limit'] as string) || 20;
    const books = await Book.find({ totalRatings: { $gt: 0 } })
      .sort({ totalRatings: -1 })
      .limit(limit);
    res.json(books.map(mapBookForFrontend));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular books' });
  }
};

export const trending = async (_req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(_req.query['limit'] as string) || 20;
    const books = await Book.find({
      averageRating: { $gte: 6 },
      totalRatings: { $gte: 3 },
    })
      .sort({ averageRating: -1 })
      .limit(limit);
    res.json(books.map(mapBookForFrontend));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending books' });
  }
};

export const recommended = async (_req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(_req.query['limit'] as string) || 20;
    const books = await Book.find({
      averageRating: { $gte: 7 },
      totalRatings: { $gte: 5 },
    })
      .sort({ averageRating: -1 })
      .limit(limit);
    res.json(books.map(mapBookForFrontend));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommended books' });
  }
};

export const personalized = async (_req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(_req.query['limit'] as string) || 20;
    const books = await Book.find({
      averageRating: { $gte: 5 },
      totalRatings: { $gte: 2 },
    })
      .sort({ averageRating: -1 })
      .limit(limit);
    res.json(books.map(mapBookForFrontend));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch personalized picks' });
  }
};

export const categories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Book.aggregate([
      { $group: { _id: '$publisher', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
    ]);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const genres = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await Book.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
    ]);
    const all = GENRE_LIST.map((name) => {
      const found = result.find((r: { name: string }) => r.name === name);
      return { name, count: found ? found.count : 0 };
    }).filter((g) => g.count > 0);
    res.json(all);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
};

export const searchAuthors = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = req.query['q'] as string;
    if (!q || q.length < 2) {
      res.json({ authors: [] });
      return;
    }
    const authors = await Book.distinct('author', {
      author: { $regex: q, $options: 'i' },
    });
    res.json({ authors: authors.slice(0, 20) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search authors' });
  }
};

export const booksByPublisher = async (req: Request, res: Response): Promise<void> => {
  try {
    const publisher = req.params['publisher'] as string;
    if (!publisher) {
      res.status(400).json({ error: 'Publisher is required' });
      return;
    }
    const page = parseInt(req.query['page'] as string) || 1;
    const limit = parseInt(req.query['limit'] as string) || 20;
    const skip = (page - 1) * limit;

    const books = await Book.find({ publisher: { $regex: publisher, $options: 'i' } })
      .sort({ totalRatings: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Book.countDocuments({ publisher: { $regex: publisher, $options: 'i' } });
    const totalPages = Math.ceil(total / limit);

    res.json({ books: books.map(mapBookForFrontend), total, page, totalPages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books by publisher' });
  }
};
