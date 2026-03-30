import axios from 'axios';

const api = axios.create({ baseURL: '/api/v1' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data?.data ?? res.data,
  (err) => {
    const msg = err.response?.data?.message || err.message;
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(new Error(Array.isArray(msg) ? msg[0] : msg));
  },
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  profile: () => api.get('/auth/profile'),
};

export const resumeApi = {
  upload: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post('/resume/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  list: () => api.get('/resume'),
  get: (id) => api.get(`/resume/${id}`),
  analysis: (id) => api.get(`/resume/${id}/analysis`),
  reanalyze: (id) => api.post(`/resume/${id}/reanalyze`),
};

export const jdApi = {
  match: (data) => api.post('/jd-match', data),
  history: () => api.get('/jd-match/history'),
  get: (id) => api.get(`/jd-match/${id}`),
};

export const interviewApi = {
  start: (data) => api.post('/interview/start', data),
  sessions: () => api.get('/interview/sessions'),
  session: (id) => api.get(`/interview/sessions/${id}`),
  answer: (sessionId, data) => api.post(`/interview/sessions/${sessionId}/answer`, data),
  end: (id) => api.patch(`/interview/sessions/${id}/end`),
};

export const analyticsApi = {
  dashboard: () => api.get('/analytics/dashboard'),
  resumeHistory: () => api.get('/analytics/resume-history'),
  interviewPerformance: () => api.get('/analytics/interview-performance'),
};

export default api;
