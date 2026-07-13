import api from './api';
import type { RecommendationResponse } from '../types/book';

export const getRecommendations = async (bookTitle: string): Promise<RecommendationResponse> => {
  const { data } = await api.post<RecommendationResponse>('/recommend', {
    book_title: bookTitle,
  });
  return data;
};

export const getAIStatus = async (): Promise<{ status: string; model_loaded: boolean }> => {
  const { data } = await api.get('/recommend/status');
  return data;
};
