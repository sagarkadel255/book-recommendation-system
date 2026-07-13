import fs from 'fs';
import path from 'path';

export interface Book {
  isbn: string;
  title: string;
  author: string;
  year: string;
  publisher: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
}

let booksCache: Book[] = [];
let ratingsMap: Map<string, { total: number; count: number }> = new Map();

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i]!;
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ';' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  return fields;
}

function parseCSVLineComma(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i]!;
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  return fields;
}

export function loadBookData(dataPath: string): void {
  console.log('Loading book data from CSV files...');

  const ratingsFile = path.join(dataPath, 'Ratings.csv');
  if (fs.existsSync(ratingsFile)) {
    const ratingsContent = fs.readFileSync(ratingsFile, 'latin1');
    const ratingsLines = ratingsContent.split('\n');

    const ratingsHeader = ratingsLines[0] || '';
    const usesSemicolon = ratingsHeader.includes(';');

    for (let i = 1; i < ratingsLines.length; i++) {
      const line = ratingsLines[i]!.trim();
      if (!line) continue;

      const fields = usesSemicolon ? parseCSVLine(line) : parseCSVLineComma(line);
      if (fields.length < 3) continue;

      const isbn = (fields[1] || '').replace(/"/g, '').trim();
      const rating = parseInt(fields[2] || '0', 10);

      if (isbn && rating > 0) {
        const existing = ratingsMap.get(isbn);
        if (existing) {
          existing.total += rating;
          existing.count += 1;
        } else {
          ratingsMap.set(isbn, { total: rating, count: 1 });
        }
      }
    }
    console.log(`Loaded ratings for ${ratingsMap.size} books`);
  }

  const booksFile = path.join(dataPath, 'Books.csv');
  if (!fs.existsSync(booksFile)) {
    console.error('Books.csv not found at', booksFile);
    return;
  }

  const content = fs.readFileSync(booksFile, 'latin1');
  const lines = content.split('\n');

  const header = lines[0] || '';
  const bookUsesSemicolon = header.includes(';');

  const books: Book[] = [];
  const seenISBN = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]!.trim();
    if (!line) continue;

    const fields = bookUsesSemicolon ? parseCSVLine(line) : parseCSVLineComma(line);
    if (fields.length < 8) continue;

    const isbn = (fields[0] || '').replace(/"/g, '').trim();
    const title = (fields[1] || '').replace(/"/g, '').trim();
    const author = (fields[2] || '').replace(/"/g, '').trim();
    const year = (fields[3] || '').replace(/"/g, '').trim();
    const publisher = (fields[4] || '').replace(/"/g, '').trim();
    
    let imageUrl = (fields[7] || fields[6] || fields[5] || '').replace(/"/g, '').trim();

    if (!isbn || !title || seenISBN.has(isbn)) continue;
    seenISBN.add(isbn);

    const ratingData = ratingsMap.get(isbn);
    const avgRating = ratingData ? Math.round((ratingData.total / ratingData.count) * 10) / 10 : 0;
    const ratingCount = ratingData ? ratingData.count : 0;

    if (imageUrl && imageUrl.includes('images.amazon.com')) {
      imageUrl = imageUrl.replace('._SX', '._SY').replace(/\._S[A-Z]\d+_/, '');
    }

    books.push({
      isbn,
      title,
      author,
      year,
      publisher,
      imageUrl,
      rating: avgRating,
      ratingCount,
    });
  }

  booksCache = books;
  console.log(`Loaded ${booksCache.length} books`);
}

export function getAllBooks(
  page: number = 1,
  limit: number = 20,
  search?: string,
  sort?: string
): { books: Book[]; total: number; page: number; totalPages: number } {
  let filtered = booksCache;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.publisher.toLowerCase().includes(q)
    );
  }

  if (sort === 'rating') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  } else if (sort === 'title') {
    filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === 'year') {
    filtered = [...filtered].sort((a, b) => parseInt(b.year) - parseInt(a.year));
  } else {
    
    filtered = [...filtered].sort((a, b) => b.ratingCount - a.ratingCount);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const books = filtered.slice(start, start + limit);

  return { books, total, page, totalPages };
}

export function getBookByISBN(isbn: string): Book | undefined {
  return booksCache.find((b) => b.isbn === isbn);
}

export function searchBooks(query: string, limit: number = 20): Book[] {
  const q = query.toLowerCase();
  return booksCache
    .filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
    )
    .sort((a, b) => b.ratingCount - a.ratingCount)
    .slice(0, limit);
}

export function getPopularBooks(limit: number = 20): Book[] {
  return [...booksCache]
    .filter((b) => b.ratingCount > 0)
    .sort((a, b) => b.ratingCount - a.ratingCount)
    .slice(0, limit);
}

export function getTrendingBooks(limit: number = 20): Book[] {
  return [...booksCache]
    .filter((b) => b.rating >= 6 && b.ratingCount >= 3)
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
}

export function getRecommendedBooks(limit: number = 20): Book[] {
  return [...booksCache]
    .filter((b) => b.rating >= 7 && b.ratingCount >= 5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function getPersonalizedPicks(limit: number = 20): Book[] {
  return [...booksCache]
    .filter((b) => b.ratingCount >= 2 && b.rating >= 5)
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
}

export function getCategories(): { name: string; count: number }[] {
  const publisherCounts = new Map<string, number>();
  for (const book of booksCache) {
    if (book.publisher) {
      publisherCounts.set(book.publisher, (publisherCounts.get(book.publisher) || 0) + 1);
    }
  }
  return Array.from(publisherCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);
}

export function getBooksByPublisher(publisher: string, page: number = 1, limit: number = 20) {
  const filtered = booksCache.filter(
    (b) => b.publisher.toLowerCase() === publisher.toLowerCase()
  );
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const books = filtered.slice(start, start + limit);
  return { books, total, page, totalPages };
}

export function getBookByTitle(title: string): Book | undefined {
  return booksCache.find((b) => b.title.toLowerCase() === title.toLowerCase());
}

export function getBooksByTitles(titles: string[]): Book[] {
  const titleSet = new Set(titles.map(t => t.toLowerCase()));
  return booksCache.filter((b) => titleSet.has(b.title.toLowerCase()));
}
