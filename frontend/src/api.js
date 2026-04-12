import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Restaurant APIs
export const getRestaurants = () => api.get('/restaurants');
export const getRestaurantById = (id) => api.get(`/restaurants/${id}`);
export const createRestaurant = (data) => api.post('/restaurants', data);
export const updateRestaurant = (id, data) => api.put(`/restaurants/${id}`, data);
export const deleteRestaurant = (id) => api.delete(`/restaurants/${id}`);
export const toggleRestaurantStatus = (id) => api.patch(`/restaurants/${id}/toggle-status`);

// Session APIs (stores restaurant info)
export const getSessions = () => api.get('/sessions');
export const getSessionById = (id) => api.get(`/sessions/${id}`);
export const createSession = (data) => api.post('/sessions', data);
export const updateSession = (id, data) => api.put(`/sessions/${id}`, data);
export const deleteSession = (id) => api.delete(`/sessions/${id}`);

export default api;
