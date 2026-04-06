import api from './axiosInstance';

export const getOrders = (params) => api.get('/orders', { params });
export const createOrder = (data) => api.post('/orders', data);
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status });
export const getDashboardStats = () => api.get('/dashboard/stats');
