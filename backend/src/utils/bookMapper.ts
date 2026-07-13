import type { IBook } from '../models/Book';

export const mapBookForFrontend = (doc: IBook) => ({
  isbn: doc.isbn,
  title: doc.title,
  author: doc.author,
  year: doc.publicationYear,
  publisher: doc.publisher,
  imageUrl: doc.imageUrl,
  rating: doc.averageRating,
  ratingCount: doc.totalRatings,
});
