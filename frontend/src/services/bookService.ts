import api from './api';
import type { Book, BooksResponse, SearchResponse, Category } from '../types/book';

export const getBooks = async (
  page: number = 1,
  limit: number = 20,
  search?: string,
  sort?: string,
  filters?: { genre?: string; author?: string; minYear?: string; maxYear?: string }
): Promise<BooksResponse> => {
  const params: Record<string, string | number> = { page, limit };
  if (search) params.search = search;
  if (sort) params.sort = sort;
  if (filters?.genre) params.genre = filters.genre;
  if (filters?.author) params.author = filters.author;
  if (filters?.minYear) params.minYear = filters.minYear;
  if (filters?.maxYear) params.maxYear = filters.maxYear;
  const { data } = await api.get<BooksResponse>('/books', { params });
  return data;
};

export const getBookByISBN = async (isbn: string): Promise<Book> => {
  const { data } = await api.get<Book>(`/books/${isbn}`);
  return data;
};

export const getBookByTitle = async (title: string): Promise<Book> => {
  const { data } = await api.get<Book>('/books/detail', { params: { title } });
  return data;
};

export const searchBooks = async (query: string, limit: number = 20): Promise<SearchResponse> => {
  const { data } = await api.get<SearchResponse>('/books/search', { params: { q: query, limit } });
  return data;
};

export const getPopularBooks = async (limit: number = 20): Promise<Book[]> => {
  const { data } = await api.get<Book[]>('/books/popular', { params: { limit } });
  return data;
};

export const getTrendingBooks = async (limit: number = 20): Promise<Book[]> => {
  const { data } = await api.get<Book[]>('/books/trending', { params: { limit } });
  return data;
};

export const getRecommendedBooks = async (limit: number = 20): Promise<Book[]> => {
  const { data } = await api.get<Book[]>('/books/recommended', { params: { limit } });
  return data;
};

export const getPersonalizedPicks = async (limit: number = 20): Promise<Book[]> => {
  const { data } = await api.get<Book[]>('/books/personalized', { params: { limit } });
  return data;
};

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<Category[]>('/books/categories');
  return data;
};

export const getGenres = async (): Promise<Category[]> => {
  const { data } = await api.get<Category[]>('/books/genres');
  return data;
};

export const searchAuthors = async (query: string): Promise<string[]> => {
  const { data } = await api.get<{ authors: string[] }>('/books/authors', { params: { q: query } });
  return data.authors;
};
