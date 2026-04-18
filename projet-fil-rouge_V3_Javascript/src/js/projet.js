/**
 * projet.js — Rendu des cartes projets
 * Responsable de l'affichage de la grille de projets.
 */

import { getAllProjets } from './api.js';

// Map des couleurs par catégorie
const CATEGORIE_COLORS = {
  Web:       'bg-blue-500',
  App:       'bg-purple-500',
  'UI/UX':   'bg-pink-500',
  Mobile:    'bg-green-500',
  'E-commerce': 'bg-orange-500',
  Santé:     'bg-teal-500',
};

/**
 * Génère le HTML d'une carte projet.
 * @param {Object} projet
 * @returns {string}
 */

// creation de la carte projet
export function renderProjetCard(projet) {
  const badgeColor = CATEGORIE_COLORS[projet.categorie] || 'bg-slate-500';
  const dateFormatted = new Date(projet.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const techsHtml = projet.technologies
    .slice(0, 3)
    .map(
      (t) =>
        `<span class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">${t}</span>`
    )
    .join('');

  const extra = projet.technologies.length > 3
    ? `<span class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">+${projet.technologies.length - 3}</span>`
    : '';

  return `
    <div class="project-card group" data-id="${projet.id}">
      <!-- IMAGE -->
      <div class="relative overflow-hidden">
        <img
          src="${projet.image}"
          alt="${projet.nom}"
          class="w-full h-48 object-cover"
          loading="lazy"
          onerror="this.src='https://placehold.co/600x400/1a2f5a/f59e0b?text=${encodeURIComponent(projet.nom)}'"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span class="absolute top-3 left-3 ${badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow">
          ${projet.categorie}
        </span>
      </div>

      <!-- CONTENU -->
      <div class="p-5">
        <h3 class="font-extrabold text-lg text-slate-800 mb-1 line-clamp-1">${projet.nom}</h3>
        <p class="text-xs text-slate-400 mb-3 flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          ${dateFormatted}
        </p>

        <!-- TECHNOLOGIES -->
        <div class="flex flex-wrap gap-1.5 mb-4">
          ${techsHtml}${extra}
        </div>

        <!-- ACTIONS -->
        <div class="flex gap-2">
          <button
            class="flex-1 flex items-center justify-center gap-1.5 bg-navy text-white font-semibold py-2 rounded-xl hover:bg-navy-mid transition text-sm btn-voir"
            data-id="${projet.id}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9.07 4.07A9.97 9.97 0 002 12C2 6.48 6.48 2 12 2s10 4.48 10 10a9.97 9.97 0 01-1.93 5.93"/>
            </svg>
            Détails
          </button>
          <button
            class="flex items-center justify-center gap-1 bg-red-50 text-red-500 border border-red-200 font-semibold px-3 py-2 rounded-xl hover:bg-red-500 hover:text-white transition text-sm btn-supprimer"
            data-id="${projet.id}"
            title="Supprimer">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>`;
}


/**
 * 
 affichage grille de projets
  * Affiche la grille complète des projets.
 * @param {string} containerId — id du conteneur HTML
 * @param {Array} projets — liste (optionnelle, sinon charge depuis API)
 */
export function renderProjetsGrid(containerId, projets = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const liste = projets ?? getAllProjets();

  if (liste.length === 0) {
    container.innerHTML = `
      <div class="col-span-3 text-center py-20 text-slate-400">
        <svg class="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p class="text-lg font-medium">Aucun projet trouvé</p>
        <p class="text-sm mt-1">Ajoutez votre premier projet !</p>
      </div>`;
    return;
  }

  container.innerHTML = liste.map(renderProjetCard).join('');
}


/**
 * Met à jour les statistiques (nombre de projets, technologies, année).
 * @param {Array} projets
 */
export function updateStats(projets) {
  const allTechs = new Set(projets.flatMap((p) => p.technologies));
  const lastDate = projets
    .map((p) => new Date(p.date))
    .sort((a, b) => b - a)[0];

  const elCount = document.getElementById('stat-count');
  const elTechs = document.getElementById('stat-techs');
  const elDate  = document.getElementById('stat-date');

  if (elCount) elCount.textContent = projets.length;
  if (elTechs) elTechs.textContent = allTechs.size;
  if (elDate && lastDate)
    elDate.textContent = lastDate.getFullYear();
}
