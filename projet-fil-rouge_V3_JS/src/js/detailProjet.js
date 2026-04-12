import { getProjetById } from './api.js';

// Map couleurs par catégorie
const CATEGORIE_COLORS = {
  Web:          { bg: 'bg-blue-500',   text: 'text-blue-600',   light: 'bg-blue-50' },
  App:          { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50' },
  'UI/UX':      { bg: 'bg-pink-500',   text: 'text-pink-600',   light: 'bg-pink-50' },
  Mobile:       { bg: 'bg-green-500',  text: 'text-green-600',  light: 'bg-green-50' },
  'E-commerce': { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50' },
  Santé:        { bg: 'bg-teal-500',   text: 'text-teal-600',   light: 'bg-teal-50' },
};