import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aura_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('aura_token');
      localStorage.removeItem('aura_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  profile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

export const conversations = {
  list: () => api.get('/conversations'),
  get: (id: string) => api.get(`/conversations/${id}`),
  create: (title?: string) => api.post('/conversations', { title }),
  sendMessage: (id: string, message: string) =>
    api.post(`/conversations/${id}/messages`, { message }),
  delete: (id: string) => api.delete(`/conversations/${id}`),
};

export const tasks = {
  list: (params?: any) => api.get('/tasks', { params }),
  create: (data: any) => api.post('/tasks', data),
  update: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

export const notes = {
  list: (params?: any) => api.get('/notes', { params }),
  create: (data: any) => api.post('/notes', data),
  update: (id: string, data: any) => api.put(`/notes/${id}`, data),
  delete: (id: string) => api.delete(`/notes/${id}`),
};

export const memories = {
  list: (params?: any) => api.get('/memories', { params }),
  create: (data: any) => api.post('/memories', data),
  update: (id: string, data: any) => api.put(`/memories/${id}`, data),
  delete: (id: string) => api.delete(`/memories/${id}`),
};

export const study = {
  list: () => api.get('/study'),
  create: (data: any) => api.post('/study', data),
  summarize: (id: string) => api.post(`/study/${id}/summarize`),
  generateQuiz: (id: string) => api.post(`/study/${id}/quiz`),
  generateFlashcards: (id: string) => api.post(`/study/${id}/flashcards`),
  updateProgress: (id: string, progress: number) =>
    api.put(`/study/${id}/progress`, { progress }),
  delete: (id: string) => api.delete(`/study/${id}`),
};

export const planner = {
  list: (params?: any) => api.get('/planner', { params }),
  create: (data: any) => api.post('/planner', data),
  generate: (date?: string) => api.post('/planner/generate', { date }),
  update: (id: string, data: any) => api.put(`/planner/${id}`, data),
};

export const analytics = {
  dashboard: () => api.get('/analytics/dashboard'),
};

export default api;
