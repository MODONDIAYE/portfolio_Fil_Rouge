/**
 * api.js — Service d'accès à l'API REST factice (json-server)
 * Endpoint : http://localhost:3001/projets
 */
import axios from 'axios';

const API_URL = 'http://localhost:3001/projets';

export const api = {
  getAll: () => axios.get(API_URL).then((r) => r.data),
  getById: (id) => axios.get(`${API_URL}/${id}`).then((r) => r.data),
  create: (projet) => axios.post(API_URL, projet).then((r) => r.data),
  update: (id, data) => axios.put(`${API_URL}/${id}`, data).then((r) => r.data),
  remove: (id) => axios.delete(`${API_URL}/${id}`).then((r) => r.data),
};
