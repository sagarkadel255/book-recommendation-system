import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import app from './app';
import { connectDB } from './config/db';
import { seedBooksFromCSV } from './utils/seedDatabase';
import { migrateGenres } from './utils/migrateGenres';

const PORT = process.env['PORT'] || 3001;
const DATA_PATH = process.env['DATA_PATH'] || '../ai-engine/data/raw';

const resolvedDataPath = path.resolve(__dirname, '..', DATA_PATH);

connectDB().then(async () => {
  try {
    
    await seedBooksFromCSV(resolvedDataPath);
    
    await migrateGenres();
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 BookNest Backend running on http://localhost:${PORT}`);
    console.log(`📚 Data path configured to: ${resolvedDataPath}`);
  });
}).catch((error) => {
  console.error('Failed to connect to MongoDB:', error);
  process.exit(1);
});
