import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api.js';
import Projet from './Projet.jsx';
import AjouterProjet from './AjouterProjet.jsx';
import DetaillerProjet from './DetaillerProjet.jsx';

/**
 * Dossier — Composant chargé de gérer la liste des projets.
 * Responsabilités : stocker, charger, ajouter, rechercher, supprimer, éditer.
 */
export default function Dossier() {
  
  // ==========================================
  // 1. ÉTATS (STATES)
  // ==========================================
  const [projets, setProjets] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [categorie, setCategorie] = useState('Toutes');
  const [projetDetail, setProjetDetail] = useState(null); // projet sélectionné
  const [modeEdition, setModeEdition] = useState(false);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ==========================================
  // 2. LOGIQUE D'API (CRUD)
  // ==========================================
  
  // Chargement initial
  const charger = async () => {
    try {
      setLoading(true);
      const data = await api.getAll();
      setProjets(data);
      setErreur(null);
    } catch (e) {
      setErreur("Impossible de joindre json-server (http://localhost:3001). Lancez : npm run server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  // Création
  const ajouterProjet = async (projet) => {
    const created = await api.create(projet);
    setProjets((prev) => [...prev, created]);
    setShowForm(false);
  };

  // Suppression
  const supprimerProjet = async (id) => {
    if (!window.confirm('Confirmer la suppression de ce projet ?')) return;
    await api.remove(id);
    setProjets((prev) => prev.filter((p) => p.id !== id));
    if (projetDetail?.id === id) setProjetDetail(null);
  };

  // Mise à jour (Update)
  const mettreAJourProjet = async (id, data) => {
    const updated = await api.update(id, { ...data, id });
    setProjets((prev) => prev.map((p) => (p.id === id ? updated : p)));
    setProjetDetail(updated);
    setModeEdition(false);
  };
  // ==========================================
  // 3. GESTION DE L'INTERFACE (UI HANDLERS)
  // ==========================================
  
  const ouvrirDetail = (projet) => {
    setProjetDetail(projet);
    setModeEdition(false);
    setTimeout(() => {
      document.getElementById('detail-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const fermerDetail = () => {
    setProjetDetail(null);
    setModeEdition(false);
  };

  // ==========================================
  // 4. LOGIQUE DE FILTRAGE & CALCULS (MEMO)
  // ==========================================
  
  // Générer la liste unique des catégories
  const categories = useMemo(
    () => ['Toutes', ...Array.from(new Set(projets.map((p) => p.categorie)))],
    [projets]
  );

  // Filtrer les projets selon la recherche et la catégorie
  const projetsFiltres = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return projets.filter((p) => {
      const okCat = categorie === 'Toutes' || p.categorie === categorie;
      const okRech =
        !q ||
        p.nom.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.technologies?.some((t) => t.toLowerCase().includes(q));
      return okCat && okRech;
    });
  }, [projets, recherche, categorie]);

  // ==========================================
  // 5. RENDU (JSX)
  // ==========================================
  return (
    <section id="projets" className="dossier-section">
      <div className="container">
        
        {/* En-tête de section */}
        <div className="section-header">
          <span className="section-label">Mes Réalisations</span>
          <h2 className="section-title">Dossier de Projets</h2>
          <div className="section-divider" />
          <p className="section-subtitle">
            CRUD complet via une API REST factice.
          </p>
        </div>

        {/* Barre d'outils (Recherche, Filtres, Bouton Ajout) */}
        <div className="toolbar">
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="text"
              placeholder="Rechercher un projet, une techno…"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </div>

          <div className="filters">
            {categories.map((c) => (
              <button
                key={c}
                className={`chip ${categorie === c ? 'active' : ''}`}
                onClick={() => setCategorie(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
            <i className={`fa-solid ${showForm ? 'fa-xmark' : 'fa-plus'}`} />
            {showForm ? 'Fermer' : 'Ajouter un projet'}
          </button>
        </div>

        {/* Formulaire d'ajout (conditionnel) */}
        {showForm && (
          <AjouterProjet
            onAjouter={ajouterProjet}
            onAnnuler={() => setShowForm(false)}
          />
        )}

        {/* Affichage des états (Loading/Erreur) */}
        {loading && <p className="info">Chargement des projets…</p>}
        {erreur && <p className="error">{erreur}</p>}

        {/* Liste des projets (Grille) */}
        {!loading && !erreur && (
          <>
            <p className="count">
              {projetsFiltres.length} projet{projetsFiltres.length > 1 ? 's' : ''} affiché(s)
            </p>

            {projetsFiltres.length === 0 ? (
              <div className="empty">
                <i className="fa-solid fa-folder-open" />
                <p>Aucun projet trouvé.</p>
              </div>
            ) : (
              <div className="grid">
                {projetsFiltres.map((p) => (
                  <Projet
                    key={p.id}
                    projet={p}
                    onSupprimer={supprimerProjet}
                    onAfficherDetail={ouvrirDetail}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Section Détail (conditionnelle) */}
        {projetDetail && (
          <div id="detail-section">
            <DetaillerProjet
              projet={projetDetail}
              modeEdition={modeEdition}
              onAnnuler={fermerDetail}
              onEditer={() => setModeEdition(true)}
              onAnnulerEdition={() => setModeEdition(false)}
              onEnregistrer={(data) => mettreAJourProjet(projetDetail.id, data)}
            />
          </div>
        )}

      </div>
    </section>
  );
}