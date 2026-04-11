/**
 * main.js — Point d'entrée et orchestration des modules
 *
 * Gère le routage SPA basé sur les hash (#home, #projets, #ajouter, #contact, #detail-{id})
 * et initialise les modules selon la vue active.
 */

import { getAllProjets } from './js/api.js';
import { renderProjetsGrid, updateStats } from './js/projet.js';
import {
  initSuppressionListeners,
  initRecherche,
  initFiltresCategorie,
  initVoirListeners,
  initFormulaireAjout,
} from './js/gestionProjets.js';
import { renderDetailProjet } from './js/detailProjet.js';
import {
  initNavbar,
  initScrollAnimations,
  animateSkillBars,
  initSmoothScroll,
} from './js/ui.js';

// ─── Vues HTML ────────────────────────────────────────────────────────────────

const VIEWS = {
  home: () => renderHome(),
  projets: () => renderProjets(),
  ajouter: () => renderAjouter(),
  contact: () => renderContact(),
};

// ─── Routeur SPA ──────────────────────────────────────────────────────────────

function router() {
  const hash = window.location.hash.replace('#', '') || 'home';

  // Route vers le détail d'un projet
  if (hash.startsWith('detail-')) {
    const id = Number(hash.replace('detail-', ''));
    renderDetail(id);
    return;
  }

  const view = VIEWS[hash];
  if (view) {
    view();
  } else {
    VIEWS.home();
  }
}
