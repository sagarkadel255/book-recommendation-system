import Book from '../models/Book';
import { mapPublisherToGenre } from './genreMapping';

export async function migrateGenres(): Promise<void> {
  const total = await Book.countDocuments({ genre: { $exists: false } });
  if (total === 0) {
    console.log('📚 Genre field already populated for all books');
    return;
  }

  console.log(`📚 Migrating genres for ${total} books...`);

  const books = await Book.find({ genre: { $exists: false } })
    .select('_id publisher')
    .lean();

  const ops = books.map((b: any) => ({
    updateOne: {
      filter: { _id: b._id },
      update: { $set: { genre: mapPublisherToGenre(b.publisher || '') } },
    },
  }));

  const batchSize = 10000;
  for (let i = 0; i < ops.length; i += batchSize) {
    const batch = ops.slice(i, i + batchSize);
    await Book.bulkWrite(batch, { ordered: false });
    console.log(`  ${Math.min(i + batchSize, ops.length)}/${ops.length} genres assigned`);
  }

  console.log('✅ Genre migration complete');
}
