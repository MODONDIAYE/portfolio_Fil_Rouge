/**
 * api.js — Service d'accès à l'API REST Express/MongoDB (port 5000)
 * Endpoint : http://localhost:5000/api/projets
 * Remplace json-server (port 3001)
 */
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/projects';

export const api = {
  getAll:  ()        => axios.get(API_URL).then((r) => r.data.data || r.data),
  getById: (id)      => axios.get(`${API_URL}/${id}`).then((r) => r.data.data || r.data),
  create:  (projet)  => axios.post(API_URL, {
    title:        projet.nom,
    short:        projet.description?.slice(0, 200) || projet.nom,
    description:  projet.description || '',
    type:         projet.categorie || 'Web',
    status:       'En cours',
    tags:         projet.technologies || [],
    github:       projet.lien || '',
    image:        projet.image || null,
    features:     projet.description2 ? [projet.description2] : [],
  }).then((r) => _toV4(r.data.data)),
  update:  (id, data) => axios.put(`${API_URL}/${id}`, {
    title:        data.nom,
    short:        data.description?.slice(0, 200) || data.nom,
    description:  data.description || '',
    type:         data.categorie || 'Web',
    tags:         data.technologies || [],
    github:       data.lien || '',
    image:        data.image || null,
    features:     data.description2 ? [data.description2] : [],
  }).then((r) => _toV4(r.data.data)),
  remove:  (id)      => axios.delete(`${API_URL}/${id}`).then((r) => r.data),
};

// Convertit le format MongoDB → format V4 (nom, categorie, technologies, lien)
function _toV4(p) {
  if (!p) return p;
  return {
    id:           p._id,
    _id:          p._id,
    nom:          p.title,
    categorie:    p.type,
    date:         p.createdAt,
    description:  p.description,
    description2: p.features?.[0] || '',
    technologies: p.tags || [],
    image:        p.image || null,
    lien:         p.github || '',
  };
}

