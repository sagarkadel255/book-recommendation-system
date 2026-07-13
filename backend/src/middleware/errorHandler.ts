import type { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { ZodError } from 'zod';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`, err.stack);

  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({ error: 'File too large. Maximum size is 2MB.' });
      return;
    }
    res.status(400).json({ error: `Upload error: ${err.message}` });
    return;
  }

  if (err instanceof ZodError) {
    res.status(422).json({
      error: 'Validation failed',
      details: (err as any).errors.map((e: any) => ({ path: e.path.join('.'), message: e.message })),
    });
    return;
  }

  if (err.message && err.message.includes('Only JPEG')) {
    res.status(415).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
}
