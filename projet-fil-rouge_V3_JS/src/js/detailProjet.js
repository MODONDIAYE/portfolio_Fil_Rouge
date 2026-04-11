/**
 * detailProjet.js — Affichage détaillé d'un projet
 * Gère le rendu de la vue modale/section détail.
 */

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

/**
 * Affiche les détails d'un projet dans le conteneur donné.
 * @param {number} id
 * @param {string} containerId
 */
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

  container.innerHTML = `
    <div class="max-w-4xl mx-auto animate-fade-in-up">

      <!-- BREADCRUMB -->
      <nav class="flex items-center gap-2 text-sm text-slate-400 mb-8">
        <button class="btn-retour-liste hover:text-amber-500 transition flex items-center gap-1">
        <i class="fas fa-arrow-left w-4 h-4"></i>
          </svg>
          Projets
        </button>
        <span>/</span>
        <span class="text-slate-600 font-medium">${projet.nom}</span>
      </nav>

      <!-- HERO IMAGE -->
      <div class="relative rounded-2xl overflow-hidden mb-8 shadow-xl">
        <img
          src="${projet.image}"
          alt="${projet.nom}"
          class="w-full h-72 md:h-96 object-cover"
          onerror="this.src='https://placehold.co/1200x500/1a2f5a/f59e0b?text=${encodeURIComponent(projet.nom)}'"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div class="absolute bottom-6 left-6 right-6 flex items-end justify-between">
          <div>
            <span class="inline-block ${colors.bg} text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow">
              ${projet.categorie}
            </span>
            <h1 class="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">${projet.nom}</h1>
          </div>
          ${projet.lien && projet.lien !== '#'
            ? `<a href="${projet.lien}" target="_blank" rel="noopener"
                class="flex items-center gap-2 bg-amber-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl shadow hover:bg-amber-300 transition text-sm whitespace-nowrap">
                <i class="fab fa-github w-4 h-4"></i>
                </svg>
                Voir le projet
              </a>`
            : ''}
        </div>
      </div>

      <!-- CONTENU -->
      <div class="grid md:grid-cols-3 gap-8">

        <!-- Description (2/3) -->
        <div class="md:col-span-2 space-y-6">

          <!-- Section Description -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
            <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
              <span class="w-1 h-6 ${colors.bg} rounded-full inline-block"></span>
              Description
            </h2>
            <p class="text-slate-600 leading-relaxed mb-4">${projet.description}</p>
            ${projet.description2
              ? `<p class="text-slate-600 leading-relaxed">${projet.description2}</p>`
              : ''}
          </div>

          <!-- Technologies -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
            <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2 mb-5">
              <span class="w-1 h-6 ${colors.bg} rounded-full inline-block"></span>
              Technologies utilisées
            </h2>
            <div class="flex flex-wrap gap-3">${techBadges}</div>
          </div>
        </div>

        <!-- Infos latérales (1/3) -->
        <div class="space-y-4">

          <!-- Infos -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h3 class="font-bold text-slate-700 text-sm uppercase tracking-widest">Informations</h3>

            <div class="flex items-center gap-3 text-sm">
              <div class="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <i class="fas fa-calendar w-4 h-4 text-slate-500"></i>
                </svg>
              </div>
              <div>
                <p class="text-slate-400 text-xs">Date d'ajout</p>
                <p class="text-slate-700 font-medium">${dateFormatted}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 text-sm">
              <div class="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <i class="fas fa-tag w-4 h-4 text-slate-500"></i>
                </svg>
              </div>
              <div>
                <p class="text-slate-400 text-xs">Catégorie</p>
                <p class="text-slate-700 font-medium">${projet.categorie}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 text-sm">
              <div class="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                </svg>
              </div>
              <div>
                <p class="text-slate-400 text-xs">Technologies</p>
                <p class="text-slate-700 font-medium">${projet.technologies.length} utilisées</p>
              </div>
            </div>
          </div>

          <!-- Bouton retour -->
          <button class="btn-retour-liste w-full flex items-center justify-center gap-2 bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-700 transition shadow">
            <i class="fas fa-arrow-left w-4 h-4"></i>
            </svg>
            Retour à la liste
          </button>
        </div>
      </div>
    </div>`;

  // Listeners retour
  container.querySelectorAll('.btn-retour-liste').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.location.hash = '#projets';
    });
  });
}
