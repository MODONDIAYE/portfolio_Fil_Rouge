import { useState, useEffect, useMemo } from 'react';
import { projectsApi } from '../api/api';
import ProjetCard   from '../components/ProjetCard';
import ProjetDetail from '../components/ProjetDetail';
import AjouterProjet from '../components/AjouterProjet';

const TYPES = ['Tous', 'Web', 'Mobile', 'Desktop', 'API', 'Cloud', 'DevOps', 'IA', 'Autre'];

export default function Projets() {
  const [projets, setProjets]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [erreur, setErreur]           = useState(null);
  const [recherche, setRecherche]     = useState('');
  const [typeFilter, setTypeFilter]   = useState('Tous');
  const [projetDetail, setProjetDetail] = useState(null);
  const [modeEdition, setModeEdition] = useState(false);
  const [showForm, setShowForm]       = useState(false);
  const [successMsg, setSuccessMsg]   = useState('');

  // ── Chargement ────────────────────────────────────────────────────────────
  const charger = async () => {
    try {
      setLoading(true);
      const res = await projectsApi.getAll();
      setProjets(res.data || []);
      setErreur(null);
    } catch {
      setErreur("Impossible de joindre l'API Express (http://localhost:5000). Lancez : node server.js dans backend-expressJS");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { charger(); }, []);

  const flash = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const ajouterProjet = async (data) => {
    const res = await projectsApi.create(data);
    setProjets(prev => [res.data, ...prev]);
    setShowForm(false);
    flash('✅ Projet ajouté avec succès !');
  };

  const supprimerProjet = async (id) => {
    if (!window.confirm('Confirmer la suppression de ce projet ?')) return;
    await projectsApi.remove(id);
    setProjets(prev => prev.filter(p => p._id !== id));
    if (projetDetail?._id === id) setProjetDetail(null);
    flash('🗑️ Projet supprimé.');
  };

  const mettreAJour = async (id, data) => {
    const res = await projectsApi.update(id, data);
    const updated = res.data;
    setProjets(prev => prev.map(p => p._id === id ? updated : p));
    setProjetDetail(updated);
    setModeEdition(false);
    flash('✅ Projet modifié avec succès !');
  };

  const ouvrirDetail = (projet) => {
    setProjetDetail(projet);
    setModeEdition(false);
    setTimeout(() => document.getElementById('detail-section')?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  // ── Filtrage ──────────────────────────────────────────────────────────────
  const projetsFiltres = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return projets.filter(p => {
      const okType = typeFilter === 'Tous' || p.type === typeFilter;
      const okRech = !q || p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || p.tags?.some(t => t.toLowerCase().includes(q));
      return okType && okRech;
    });
  }, [projets, recherche, typeFilter]);

  return (
    <section className="dossier-section">
      <div className="container">

        <div className="section-header">
          <span className="section-label">Mes Réalisations</span>
          <h2 className="section-title">Dossier de Projets</h2>
          <div className="section-divider" />
          <p className="section-subtitle">CRUD complet via l'API REST Express.js + MongoDB Atlas.</p>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="text"
              placeholder="Rechercher un projet, une techno…"
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
            />
          </div>
          <div className="filters">
            {TYPES.map(t => (
              <button key={t} className={`chip ${typeFilter === t ? 'active' : ''}`} onClick={() => setTypeFilter(t)}>{t}</button>
            ))}
          </div>
          <button className="btn-primary" onClick={() => setShowForm(s => !s)}>
            <i className={`fa-solid ${showForm ? 'fa-xmark' : 'fa-plus'}`} />
            {showForm ? 'Fermer' : 'Ajouter un projet'}
          </button>
        </div>

        {/* Messages */}
        {successMsg && <p className="success-msg">{successMsg}</p>}
        {erreur     && <p className="error">{erreur}</p>}

        {/* Formulaire d'ajout */}
        {showForm && (
          <AjouterProjet
            onAjouter={ajouterProjet}
            onAnnuler={() => setShowForm(false)}
          />
        )}

        {/* Liste */}
        {loading ? (
          <p className="info"><i className="fa-solid fa-spinner fa-spin" /> Chargement des projets…</p>
        ) : (
          <>
            <p className="count">{projetsFiltres.length} projet{projetsFiltres.length > 1 ? 's' : ''} affiché{projetsFiltres.length > 1 ? 's' : ''}</p>
            {projetsFiltres.length === 0 ? (
              <div className="empty">
                <i className="fa-solid fa-folder-open" />
                <p>Aucun projet trouvé.</p>
              </div>
            ) : (
              <div className="grid">
                {projetsFiltres.map(p => (
                  <ProjetCard
                    key={p._id}
                    projet={p}
                    onDetail={ouvrirDetail}
                    onEditer={(proj) => { setProjetDetail(proj); setModeEdition(true); setTimeout(() => document.getElementById('detail-section')?.scrollIntoView({ behavior: 'smooth' }), 50); }}
                    onSupprimer={supprimerProjet}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Détail */}
        {projetDetail && (
          <div id="detail-section">
            <ProjetDetail
              projet={projetDetail}
              modeEdition={modeEdition}
              onAnnuler={() => { setProjetDetail(null); setModeEdition(false); }}
              onEditer={() => setModeEdition(true)}
              onAnnulerEdition={() => setModeEdition(false)}
              onEnregistrer={(data) => mettreAJour(projetDetail._id, data)}
            />
          </div>
        )}

      </div>
    </section>
  );
}
