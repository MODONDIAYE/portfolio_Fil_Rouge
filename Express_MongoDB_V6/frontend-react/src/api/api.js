import axios from 'axios';

const api = axios.create({
  // Avec le proxy Vite, /api/* est redirigé vers http://localhost:5000/api/*
  // Plus besoin de spécifier le port — ça élimine les erreurs CORS
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Projects ──────────────────────────────────────────
export const projectsApi = {
  getAll:    (params) => api.get('/projects', { params }).then(r => r.data),
  getById:   (id)     => api.get(`/projects/${id}`).then(r => r.data),
  getStats:  ()       => api.get('/projects/stats/summary').then(r => r.data),
  create:    (data)   => api.post('/projects', data).then(r => r.data),
  update:    (id, d)  => api.put(`/projects/${id}`, d).then(r => r.data),
  remove:    (id)     => api.delete(`/projects/${id}`).then(r => r.data),
};

// ── Members ───────────────────────────────────────────
export const membersApi = {
  getAll:  ()       => api.get('/members').then(r => r.data),
  getById: (id)     => api.get(`/members/${id}`).then(r => r.data),
  create:  (data)   => api.post('/members', data).then(r => r.data),
  update:  (id, d)  => api.put(`/members/${id}`, d).then(r => r.data),
  remove:  (id)     => api.delete(`/members/${id}`).then(r => r.data),
};

// ── Contact ───────────────────────────────────────────
export const contactApi = {
  send:   (data) => api.post('/contact', data).then(r => r.data),
  getAll: ()     => api.get('/contact').then(r => r.data),
};

// ── Health ────────────────────────────────────────────
export const healthApi = {
  check: () => api.get('/health').then(r => r.data),
};

export default api;
