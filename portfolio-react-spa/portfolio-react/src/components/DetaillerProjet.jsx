import React, { useState, useEffect } from 'react';

// ==========================================
// 1. CONSTANTES & CONFIGURATION
// ==========================================
const CATEGORIES = ['Web', 'App', 'UI/UX', 'Mobile', 'E-commerce', 'Santé'];

export default function DetaillerProjet({
  projet,
  modeEdition,
  onAnnuler,
  onEditer,
  onAnnulerEdition,
  onEnregistrer,
}) {
  // ==========================================
  // 2. ÉTATS & EFFETS (HOOKS)
  // ==========================================
  const [form, setForm] = useState(projet);

  // Synchronisation du formulaire avec le projet (notamment pour les technos)
  useEffect(() => {
    setForm({
      ...projet,
      technologies: Array.isArray(projet.technologies)
        ? projet.technologies.join(', ')
        : projet.technologies || '',
    });
  }, [projet, modeEdition]);

  // ==========================================
  // 3. GESTIONNAIRES D'ÉVÉNEMENTS (HANDLERS)
  // ==========================================
  
  // Mise à jour des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Soumission et formatage des données
  const handleSave = (e) => {
    e.preventDefault();
    const techs =
      typeof form.technologies === 'string'
        ? form.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : form.technologies;
    onEnregistrer({ ...form, technologies: techs });
  };
  // ==========================================
  // 4. LOGIQUE D'AFFICHAGE (HELPERS)
  // ==========================================
  const dateFormatted = projet.date
    ? new Date(projet.date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  // ==========================================
  // 5. RENDU : MODE LECTURE
  // ==========================================
  if (!modeEdition) {
    return (
      <div className="detail-card">
        {/* En-tête Lecture */}
        <div className="detail-head">
          <div>
            <span className="section-label">Détails du projet</span>
            <h2>{projet.nom}</h2>
            <p className="meta">
              <span className="badge-mini">{projet.categorie}</span>
              <span><i className="fa-regular fa-calendar" /> {dateFormatted}</span>
            </p>
          </div>
          <div className="detail-actions">
            <button className="btn-ghost" onClick={onAnnuler}>
              <i className="fa-solid fa-xmark" /> Annuler
            </button>
            <button className="btn-primary" onClick={onEditer}>
              <i className="fa-solid fa-pen" /> Editer
            </button>
          </div>
        </div>

        {/* Corps Lecture */}
        <div className="detail-body">
          {projet.image && (
            <img
              className="detail-img"
              src={projet.image}
              alt={projet.nom}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}

          <div className="detail-text">
            <h4>Description</h4>
            <p>{projet.description}</p>

            {projet.description2 && (
              <>
                <h4>Détails complémentaires</h4>
                <p>{projet.description2}</p>
              </>
            )}

            <h4>Technologies utilisées</h4>
            <div className="techs-large">
              {(projet.technologies || []).map((t) => (
                <span key={t} className="tech">{t}</span>
              ))}
            </div>

            {projet.lien && (
              <a className="btn-primary mt" href={projet.lien} target="_blank" rel="noreferrer">
                <i className="fa-brands fa-github" /> Voir le projet
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }
  // ==========================================
  // 6. RENDU : MODE ÉDITION (FORMULAIRE)
  // ==========================================
  return (
    <form className="detail-card" onSubmit={handleSave}>
      {/* En-tête Édition */}
      <div className="detail-head">
        <div>
          <span className="section-label">Édition du projet</span>
          <h2>Modifier : {projet.nom}</h2>
        </div>
        <div className="detail-actions">
          <button type="button" className="btn-ghost" onClick={onAnnulerEdition}>
            <i className="fa-solid fa-xmark" /> Annuler
          </button>
          <button type="submit" className="btn-primary">
            <i className="fa-solid fa-floppy-disk" /> Enregistrer
          </button>
        </div>
      </div>

      {/* Grille du Formulaire */}
      <div className="form-grid">
        <div className="field">
          <label>Nom</label>
          <input name="nom" value={form.nom || ''} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Catégorie</label>
          <select name="categorie" value={form.categorie || 'Web'} onChange={handleChange}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Date</label>
          <input type="date" name="date" value={(form.date || '').slice(0, 10)} onChange={handleChange} />
        </div>
        <div className="field">
          <label>Lien</label>
          <input name="lien" value={form.lien || ''} onChange={handleChange} />
        </div>
        <div className="field full">
          <label>Image (URL)</label>
          <input name="image" value={form.image || ''} onChange={handleChange} />
        </div>
        <div className="field full">
          <label>Description</label>
          <textarea name="description" rows="3" value={form.description || ''} onChange={handleChange} />
        </div>
        <div className="field full">
          <label>Description détaillée</label>
          <textarea name="description2" rows="3" value={form.description2 || ''} onChange={handleChange} />
        </div>
        <div className="field full">
          <label>Technologies (séparées par des virgules)</label>
          <input name="technologies" value={form.technologies || ''} onChange={handleChange} />
        </div>
      </div>
    </form>
  );
}