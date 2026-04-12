/**
 * gestionProjets.js — Ajout & Suppression de projets
 * Orchestre les interactions utilisateur pour la gestion du CRUD.
 */

import { createProjet, deleteProjet } from './api.js';
import { renderProjetsGrid, updateStats } from './projet.js';
import { showToast, showConfirmModal } from './ui.js';
import { getAllProjets } from './api.js';

// ─── Suppression ──────────────────────────────────────────────────────────────

/**
 * Attache les écouteurs de suppression sur tous les boutons .btn-supprimer.
 * @param {string} gridId — id de la grille à rafraîchir
 */
export function initSuppressionListeners(gridId) {
  const container = document.getElementById(gridId);
  if (!container) return;

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-supprimer');
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const projets = getAllProjets();
    const projet = projets.find((p) => p.id === id);

    showConfirmModal(
      `Voulez-vous vraiment supprimer <strong>"${projet?.nom}"</strong> ? Cette action est irréversible.`,
      () => {
        deleteProjet(id);
        const updated = getAllProjets();
        renderProjetsGrid(gridId, updated);
        updateStats(updated);
        initSuppressionListeners(gridId);
        showToast(`"${projet?.nom}" supprimé avec succès.`, 'success');
      }
    );
  });
}


// filtre de recherche
// ─── Filtre de recherche ──────────────────────────────────────────────────────

/**
 * Initialise la recherche en temps réel.
 * @param {string} inputId — id de l'input de recherche
 * @param {string} gridId  — id de la grille
 */
export function initRecherche(inputId, gridId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    const tous = getAllProjets();
    const filtres = query
      ? tous.filter(
          (p) =>
            p.nom.toLowerCase().includes(query) ||
            p.categorie.toLowerCase().includes(query) ||
            p.technologies.some((t) => t.toLowerCase().includes(query))
        )
      : tous;

    renderProjetsGrid(gridId, filtres);
    updateStats(filtres);
    initSuppressionListeners(gridId);
    initVoirListeners(gridId);
  });
}


// ─── Filtre par catégorie ─────────────────────────────────────────────────────

/**
 * Initialise les filtres par catégorie (boutons).
 * @param {string} filtreContainerId
 * @param {string} gridId
 */
export function initFiltresCategorie(filtreContainerId, gridId) {
  const container = document.getElementById(filtreContainerId);
  if (!container) return;

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-categorie]');
    if (!btn) return;

    container.querySelectorAll('[data-categorie]').forEach((b) => {
      b.classList.remove('bg-navy', 'text-white');
      b.classList.add('bg-white', 'text-slate-600');
    });
    btn.classList.add('bg-navy', 'text-white');
    btn.classList.remove('bg-white', 'text-slate-600');

    const categorie = btn.dataset.categorie;
    const tous = getAllProjets();
    const filtres =
      categorie === 'tous' ? tous : tous.filter((p) => p.categorie === categorie);

    renderProjetsGrid(gridId, filtres);
    updateStats(filtres);
    initSuppressionListeners(gridId);
    initVoirListeners(gridId);
  });
}


// voir les details
// ─── Voir détails (lien) ──────────────────────────────────────────────────────

/**
 * Attache les écouteurs de navigation vers la page détail.
 * @param {string} gridId
 */
export function initVoirListeners(gridId) {
  const container = document.getElementById(gridId);
  if (!container) return;

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-voir');
    if (!btn) return;
    const id = btn.dataset.id;
    window.location.hash = `#detail-${id}`;
  });
}


// ─── Formulaire d'ajout ───────────────────────────────────────────────────────

/**
 * Initialise et valide le formulaire d'ajout de projet.
 * @param {string} formId
 */


export function initFormulaireAjout() {
  const form = document.getElementById('formulaire-ajout-projet') || document.querySelector('#app form');
  if (!form) {
    console.warn('Formulaire ajout non trouvé');
    return;
  }

  const previewImg = document.getElementById('img-preview');
  const fileInput  = document.getElementById('projet-image');

  // Aperçu image
  fileInput?.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file && previewImg) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewImg.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    }
  });

  // Soumission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nom          = document.getElementById('projet-nom')?.value.trim();
    const description  = document.getElementById('projet-description')?.value.trim();
    const categorie    = document.getElementById('projet-categorie')?.value;
    const technologies = document.getElementById('projet-technologies')?.value
      .split(',').map((t) => t.trim()).filter(Boolean);
    const lien         = document.getElementById('projet-lien')?.value.trim();
    const date         = document.getElementById('projet-date')?.value;
    const imageFile    = fileInput?.files[0];

    if (!nom || !description || !categorie || technologies.length === 0) {
      showToast('Merci de remplir tous les champs obligatoires.', 'error');
      return;
    }

    const saveProjet = (imageSrc) => {
      const nouveau = createProjet({
        nom,
        description,
        description2: '',
        categorie,
        technologies,
        lien: lien || '#',
        date: date || new Date().toISOString().split('T')[0],
        image: imageSrc || 'https://placehold.co/600x400/1a2f5a/f59e0b?text=Projet',
      });

      showToast(`"${nouveau.nom}" ajouté avec succès !`, 'success');
      form.reset();
      if (previewImg) previewImg.classList.add('hidden');

      // Redirection vers la liste
      setTimeout(() => {
        window.location.hash = '#projets';
      }, 1000);
    };

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => saveProjet(e.target.result);
      reader.readAsDataURL(imageFile);
    } else {
      saveProjet(null);
    }
  });
}
