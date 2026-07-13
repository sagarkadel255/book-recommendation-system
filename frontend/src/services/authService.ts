import api from './api';

export const login = async (credentials: any) => {
  const { data } = await api.post('/auth/login', credentials);
  sessionStorage.setItem('booknest_access_token', data.accessToken);
  return data.user;
};

export const register = async (userData: any) => {
  const { data } = await api.post('/auth/register', userData);
  sessionStorage.setItem('booknest_access_token', data.accessToken);
  return data.user;
};

export const logout = async () => {
  await api.post('/auth/logout');
  sessionStorage.removeItem('booknest_access_token');
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const updateProfile = async (userData: any) => {
  const { data } = await api.put('/users/profile', userData);
  return data;
};

export const updateAvatar = async (formData: FormData) => {
  const { data } = await api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
