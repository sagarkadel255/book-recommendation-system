import api from './api';
import type { Book } from '../types/book';

export const toggleFavorite = async (bookId: string) => {
  const { data } = await api.post('/favorites/toggle', { bookId });
  return data;
};

export const getFavorites = async (): Promise<{ _id: string; bookId: Book }[]> => {
  const { data } = await api.get('/favorites');
  return data;
};
