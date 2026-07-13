import fs from 'fs';
import path from 'path';
import Book from '../models/Book';

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

function findDataPath(basePath: string): string | null {
  
  if (fs.existsSync(basePath)) {
    console.log(`✅ Found data path: ${basePath}`);
    return basePath;
  }

  const attempts = [
    basePath,
    path.resolve(basePath),
    path.join(process.cwd(), 'ai-engine', 'data', 'raw'),
    path.join(process.cwd(), '..', 'ai-engine', 'data', 'raw'),
    path.join(__dirname, '..', '..', '..', 'ai-engine', 'data', 'raw'),
  ];

  for (const attempt of attempts) {
    if (fs.existsSync(attempt)) {
      console.log(`✅ Found data path at: ${attempt}`);
      return attempt;
    }
  }

  return null;
}

export async function seedBooksFromCSV(dataPath: string): Promise<void> {
  try {
    
    const existingCount = await Book.countDocuments();
    if (existingCount > 0) {
      console.log(`📚 Database already contains ${existingCount} books`);
      return;
    }

    console.log('📖 Seeding books from CSV...');
    console.log(`📍 Looking for data at: ${dataPath}`);

    const actualDataPath = findDataPath(dataPath);
    if (!actualDataPath) {
      console.warn(`⚠️  Could not find data path. Tried: ${dataPath}`);
      return;
    }

    const ratingsMap = new Map<string, { total: number; count: number }>();
    const ratingsFile = path.join(actualDataPath, 'Ratings.csv');
    
    if (fs.existsSync(ratingsFile)) {
      console.log(`⭐ Reading ratings from ${ratingsFile}`);
      const ratingsContent = fs.readFileSync(ratingsFile, 'latin1');
      const ratingsLines = ratingsContent.split('\n');
      const ratingsHeader = ratingsLines[0] || '';
      const usesSemicolon = ratingsHeader.includes(';');
      console.log(`📋 Ratings CSV uses ${usesSemicolon ? 'semicolon' : 'comma'} delimiter`);

      let ratingsCount = 0;
      for (let i = 1; i < ratingsLines.length; i++) {
        const line = ratingsLines[i]!.trim();
        if (!line) continue;

        const fields = usesSemicolon ? parseCSVLine(line) : parseCSVLineComma(line);
        if (fields.length < 3) continue;

        const isbn = (fields[1] || '').replace(/"/g, '').trim();
        const rating = parseInt(fields[2] || '0', 10);

        if (isbn && rating > 0) {
          ratingsCount++;
          const existing = ratingsMap.get(isbn);
          if (existing) {
            existing.total += rating;
            existing.count += 1;
          } else {
            ratingsMap.set(isbn, { total: rating, count: 1 });
          }
        }
      }
      console.log(`⭐ Loaded ${ratingsCount} ratings for ${ratingsMap.size} unique books`);
    } else {
      console.warn(`⚠️  Ratings.csv not found at ${ratingsFile}`);
    }

    const booksFile = path.join(actualDataPath, 'Books.csv');
    if (!fs.existsSync(booksFile)) {
      console.error(`❌ Books.csv not found at ${booksFile}`);
      return;
    }

    console.log(`📖 Reading books from ${booksFile}`);
    const content = fs.readFileSync(booksFile, 'latin1');
    const lines = content.split('\n');
    const header = lines[0] || '';
    const bookUsesSemicolon = header.includes(';');
    console.log(`📋 Books CSV uses ${bookUsesSemicolon ? 'semicolon' : 'comma'} delimiter`);
    console.log(`📊 Total lines in CSV: ${lines.length}`);

    const books: any[] = [];
    const seenISBN = new Set<string>();
    let skipped = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]!.trim();
      if (!line) continue;

      const fields = bookUsesSemicolon ? parseCSVLine(line) : parseCSVLineComma(line);
      if (fields.length < 8) {
        skipped++;
        continue;
      }

      const isbn = (fields[0] || '').replace(/"/g, '').trim();
      const title = (fields[1] || '').replace(/"/g, '').trim();
      const author = (fields[2] || '').replace(/"/g, '').trim();
      const year = (fields[3] || '').replace(/"/g, '').trim();
      const publisher = (fields[4] || '').replace(/"/g, '').trim();
      let imageUrl = (fields[7] || fields[6] || fields[5] || '').replace(/"/g, '').trim();

      if (!isbn || !title) {
        skipped++;
        continue;
      }
      
      if (seenISBN.has(isbn)) {
        skipped++;
        continue;
      }

      seenISBN.add(isbn);

      const ratingData = ratingsMap.get(isbn);
      const averageRating = ratingData ? Math.round((ratingData.total / ratingData.count) * 10) / 10 : 0;
      const totalRatings = ratingData ? ratingData.count : 0;

      if (imageUrl && imageUrl.includes('images.amazon.com')) {
        imageUrl = imageUrl.replace('._SX', '._SY').replace(/\._S[A-Z]\d+_/, '');
      }

      books.push({
        isbn,
        title,
        author,
        publicationYear: year,
        publisher,
        imageUrl,
        averageRating,
        totalRatings,
      });
    }

    console.log(`📊 Parsed ${books.length} books (skipped ${skipped} invalid rows)`);

    if (books.length > 0) {
      console.log(`📥 Inserting ${books.length} books into MongoDB...`);
      try {
        await Book.insertMany(books, { ordered: false });
        console.log(`✅ Successfully seeded ${books.length} books`);
      } catch (insertError: any) {
        
        if (insertError.code === 11000) {
          const successCount = insertError.insertedDocs?.length || books.length;
          console.log(`✅ Seeded ${successCount} books (some duplicates ignored)`);
        } else {
          throw insertError;
        }
      }
    } else {
      console.warn(`⚠️  No valid books found to seed`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error seeding database: ${error.message}`);
      console.error(error.stack);
    } else {
      console.error('❌ An unknown error occurred during seeding');
    }
  }
}
