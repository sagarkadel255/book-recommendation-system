import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './config/db';
import { migrateGenres } from './utils/migrateGenres';

connectDB().then(async () => {
  console.log('Connected to MongoDB, running genre migration...');
  await migrateGenres();
  console.log('Migration complete, exiting...');
  process.exit(0);
}).catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
