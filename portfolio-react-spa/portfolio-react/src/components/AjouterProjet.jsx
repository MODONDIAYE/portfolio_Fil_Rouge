import React, { useState } from 'react';

/**
 * AjouterProjet — Formulaire de création d'un projet.
 * À la soumission, appelle onAjouter(projet) fourni par le parent (Dossier).
 */
const CATEGORIES = ['Web', 'App', 'UI/UX', 'Mobile', 'E-commerce', 'Santé'];

const initialState = {
  nom: '',
  categorie: 'Web',
  date: new Date().toISOString().slice(0, 10),
  description: '',
  description2: '',
  technologies: '',
  image: '',
  lien: '',
};

export default function AjouterProjet({ onAjouter, onAnnuler }) {
  const [form, setForm] = useState(initialState);
  const [erreurs, setErreurs] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (erreurs[name]) setErreurs((er) => ({ ...er, [name]: null }));
  };

  const valider = () => {
    const er = {};
    if (!form.nom.trim()) er.nom = 'Le nom est requis';
    if (!form.description.trim()) er.description = 'La description est requise';
    if (!form.technologies.trim()) er.technologies = 'Au moins une technologie';
    return er;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const er = valider();
    if (Object.keys(er).length > 0) {
      setErreurs(er);
      return;
    }
    setSubmitting(true);
    try {
      await onAjouter({
        ...form,
        technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
        image: form.image.trim() || null,
      });
      setForm(initialState);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h3>
        <i className="fa-solid fa-plus-circle" /> Ajouter un nouveau projet
      </h3>

      <div className="form-grid">
        <div className="field">
          <label>Nom du projet *</label>
          <input
            name="nom"
            value={form.nom}
            onChange={handleChange}
            placeholder="Ex : Mon super projet"
          />
          {erreurs.nom && <small className="err">{erreurs.nom}</small>}
        </div>

        <div className="field">
          <label>Catégorie</label>
          <select name="categorie" value={form.categorie} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Lien (GitHub, démo…)</label>
          <input
            name="lien"
            value={form.lien}
            onChange={handleChange}
            placeholder="https://github.com/…"
          />
        </div>

        <div className="field full">
          <label>URL de l'image</label>
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="/assets/mon-image.jpg ou https://…"
          />
        </div>

        <div className="field full">
          <label>Description courte *</label>
          <textarea
            name="description"
            rows="3"
            value={form.description}
            onChange={handleChange}
            placeholder="Présentation rapide du projet"
          />
          {erreurs.description && <small className="err">{erreurs.description}</small>}
        </div>

        <div className="field full">
          <label>Description détaillée</label>
          <textarea
            name="description2"
            rows="3"
            value={form.description2}
            onChange={handleChange}
            placeholder="Détails techniques, fonctionnalités avancées…"
          />
        </div>

        <div className="field full">
          <label>Technologies (séparées par des virgules) *</label>
          <input
            name="technologies"
            value={form.technologies}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB"
          />
          {erreurs.technologies && <small className="err">{erreurs.technologies}</small>}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-ghost" onClick={onAnnuler}>
          Annuler
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          <i className="fa-solid fa-check" />
          {submitting ? 'Enregistrement…' : 'Enregistrer le projet'}
        </button>
      </div>
    </form>
  );

}
