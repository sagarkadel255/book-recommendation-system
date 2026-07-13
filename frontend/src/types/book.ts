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

export interface BooksResponse {
  books: Book[];
  total: number;
  page: number;
  totalPages: number;
}

export interface SearchResponse {
  results: Book[];
  total: number;
}

export interface Category {
  name: string;
  count: number;
}

export interface RecommendationResponse {
  book_title: string;
  recommendations: Book[];
  titles: string[];
}
