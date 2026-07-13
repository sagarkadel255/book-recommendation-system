import type { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import Book from '../models/Book';
import { mapBookForFrontend } from '../utils/bookMapper';

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:5000';

const recommendBodySchema = z.object({
  book_title: z.string().min(1, 'book_title is required').max(500),
});

let consecutiveFailures = 0;
let circuitOpenUntil = 0;
const FAILURE_THRESHOLD = 3;
const RECOVERY_MS = 30_000;

function isCircuitOpen(): boolean {
  if (consecutiveFailures >= FAILURE_THRESHOLD) {
    if (Date.now() < circuitOpenUntil) return true;
    consecutiveFailures = FAILURE_THRESHOLD - 1;
  }
  return false;
}

function recordSuccess(): void {
  consecutiveFailures = 0;
}

function recordFailure(): void {
  consecutiveFailures++;
  if (consecutiveFailures >= FAILURE_THRESHOLD) {
    circuitOpenUntil = Date.now() + RECOVERY_MS;
    console.warn(`[CircuitBreaker] AI Engine circuit OPEN for ${RECOVERY_MS / 1000}s`);
  }
}

export const getRecommendations = async (req: Request, res: Response): Promise<void> => {
  const parsed = recommendBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({
      error: 'Validation failed',
      details: (parsed.error as any).errors.map((e: any) => ({ path: e.path.join('.'), message: e.message })),
    });
    return;
  }

  const { book_title } = parsed.data;

  if (isCircuitOpen()) {
    res.status(503).json({
      error: 'AI recommendation engine is temporarily unavailable. Please try again shortly.',
      retryAfter: Math.ceil((circuitOpenUntil - Date.now()) / 1000),
    });
    return;
  }

  try {
    const response = await axios.post(
      `${AI_ENGINE_URL}/recommend`,
      { book_title },
      { timeout: 10_000 }
    );

    const titles: string[] = Array.isArray(response.data?.recommendations)
      ? response.data.recommendations
      : [];

    const books = [];
    const matchedTitles = new Set<string>();

    for (const recTitle of titles) {
      
      if (matchedTitles.has(recTitle)) continue;

      let book = await Book.findOne({ title: recTitle });

      if (!book) {
        book = await Book.findOne({ title: { $regex: `^${recTitle}$`, $options: 'i' } });
      }

      if (!book && recTitle.length > 3) {
        book = await Book.findOne({ title: { $regex: recTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } });
      }

      if (book) {
        books.push(book);
        matchedTitles.add(recTitle);
      }
    }

    console.log(`[getRecommendations] Requested: ${book_title}, Got ${titles.length} recommendations, Matched ${books.length} books from DB`);
    recordSuccess();

    res.json({
      book_title: response.data.book_title || book_title,
      recommendations: books.map(mapBookForFrontend),
      titles,
    });
  } catch (error: unknown) {
    recordFailure();

    if (error instanceof AxiosError) {
      if (error.response) {
        const flaskError = error.response.data?.error || 'Book not found in the dataset';
        res.status(error.response.status).json({ error: flaskError });
      } else if (error.code === 'ECONNABORTED') {
        res.status(504).json({ error: 'AI engine request timed out.' });
      } else {
        res.status(503).json({
          error: 'AI recommendation engine is not available. Please ensure the Flask server is running.',
        });
      }
    } else {
      console.error('[RecommendController] Unexpected error:', error);
      res.status(500).json({ error: 'Internal server error processing recommendation' });
    }
  }
};

export const getStatus = async (_req: Request, res: Response): Promise<void> => {
  try {
    const response = await axios.get(`${AI_ENGINE_URL}/status`, { timeout: 5000 });
    res.json({
      ...response.data,
      circuit: {
        state: consecutiveFailures >= FAILURE_THRESHOLD ? 'open' : 'closed',
        failures: consecutiveFailures,
      },
    });
  } catch {
    res.json({
      status: 'unavailable',
      model_loaded: false,
      circuit: { state: 'unknown', failures: consecutiveFailures },
    });
  }
};
