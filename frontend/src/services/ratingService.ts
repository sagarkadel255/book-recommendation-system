import api from './api';

export interface UserRating {
  _id: string;
  bookId: string;
  rating: number;
}

export const addOrUpdateRating = async (bookId: string, rating: number) => {
  const { data } = await api.post('/ratings', { bookId, rating });
  return data;
};

export const getUserRatings = async (): Promise<UserRating[]> => {
  const { data } = await api.get<UserRating[]>('/ratings');
  return data;
};
