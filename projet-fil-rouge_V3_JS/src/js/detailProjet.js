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

export function renderDetailProjet(id, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const projet = getProjetById(id);

  if (!projet) {
    container.innerHTML = `
      <div class="text-center py-20 text-slate-400">
        <p class="text-xl font-semibold">Projet introuvable.</p>
        <button class="mt-4 btn-retour-liste text-amber-500 underline hover:text-amber-600">
          ← Retour à la liste
        </button>
      </div>`;
    return;
  }

  const colors = CATEGORIE_COLORS[projet.categorie] || { bg: 'bg-slate-500', text: 'text-slate-600', light: 'bg-slate-50' };
  const dateFormatted = new Date(projet.date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const techBadges = projet.technologies
    .map(
      (t) => `
      <span class="flex items-center gap-1.5 ${colors.light} ${colors.text} font-semibold px-4 py-2 rounded-full text-sm shadow-sm">
        <span class="w-2 h-2 rounded-full ${colors.bg} inline-block"></span>${t}
      </span>`
    ).join('');