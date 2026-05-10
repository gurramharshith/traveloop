import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  signup: (name, email, password, confirmPassword) =>
    api.post('/auth/signup', { name, email, password, confirmPassword }),
  login: (email, password) => api.post('/auth/login', { email, password }),
};

export const tripService = {
  createTrip: (data) => api.post('/trips', data),
  getTrips: () => api.get('/trips'),
  getTrip: (id) => api.get(`/trips/${id}`),
  updateTrip: (id, data) => api.put(`/trips/${id}`, data),
  deleteTrip: (id) => api.delete(`/trips/${id}`),
  getPublicTrip: (id) => api.get(`/trips/public/${id}`),
};

export const stopService = {
  createStop: (data) => api.post('/stops', data),
  getStop: (id) => api.get(`/stops/${id}`),
  updateStop: (id, data) => api.put(`/stops/${id}`, data),
  deleteStop: (id) => api.delete(`/stops/${id}`),
  reorderStops: (tripId, stopIds) => api.post('/stops/reorder', { tripId, stopIds }),
};

export const activityService = {
  createActivity: (data) => api.post('/activities', data),
  getActivity: (id) => api.get(`/activities/${id}`),
  updateActivity: (id, data) => api.put(`/activities/${id}`, data),
  deleteActivity: (id) => api.delete(`/activities/${id}`),
  searchActivities: (params) => api.get('/activities/search', { params }),
};

export const cityService = {
  searchCities: (params) => api.get('/cities/search', { params }),
  getCity: (id) => api.get(`/cities/${id}`),
  getPopularCities: () => api.get('/cities/popular'),
};

export const checklistService = {
  getChecklist: (tripId) => api.get(`/checklists/${tripId}`),
  addItem: (tripId, data) => api.post(`/checklists/${tripId}/items`, data),
  toggleItem: (tripId, itemId) => api.put(`/checklists/${tripId}/items/${itemId}/toggle`),
  deleteItem: (tripId, itemId) => api.delete(`/checklists/${tripId}/items/${itemId}`),
  resetChecklist: (tripId) => api.post(`/checklists/${tripId}/reset`),
};

export const noteService = {
  getNotes: (tripId, stopId) => api.get(`/notes/${tripId}`, { params: stopId ? { stopId } : {} }),
  createNote: (tripId, data) => api.post(`/notes/${tripId}`, data),
  updateNote: (tripId, noteId, data) => api.put(`/notes/${tripId}/${noteId}`, data),
  deleteNote: (tripId, noteId) => api.delete(`/notes/${tripId}/${noteId}`),
};

export const userService = {
  updateProfile: (data) => api.put('/users/profile', data),
  deleteAccount: () => api.delete('/users/account'),
  saveDestination: (cityId) => api.post('/users/save-destination', { cityId }),
};

export default api;
