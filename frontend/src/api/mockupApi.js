import api from './axiosInstance';

export const getMockups = (params) => api.get('/mockups', { params });
export const getMyMockups = (params) => api.get('/mockups/my', { params });
export const getMockupById = (id) => api.get(`/mockups/${id}`);

export const createMockup = (formData) =>
  api.post('/mockups', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const updateMockup = (id, formData) =>
  api.put(`/mockups/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const deleteMockup = (id) => api.delete(`/mockups/${id}`);
