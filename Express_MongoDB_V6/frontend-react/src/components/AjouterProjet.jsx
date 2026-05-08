import { useState, useRef } from 'react';

const TYPES    = ['Web', 'Mobile', 'Desktop', 'API', 'Cloud', 'DevOps', 'IA', 'Autre'];
const STATUSES = ['En cours', 'Terminé', 'Archivé'];

const initialState = {
  title: '', short: '', description: '', type: 'Web', status: 'En cours',
  tags: '', github: '', demo: '', features: '', awsServices: '', image: '',
};

// Convertit un fichier local en base64
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function AjouterProjet({ onAjouter, onAnnuler }) {
  const [form, setForm]           = useState(initialState);
  const [erreurs, setErreurs]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // aperçu local
  const [imageMode, setImageMode] = useState('url');      // 'url' | 'local'
  const fileInputRef = useRef(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (erreurs[name]) setErreurs(er => ({ ...er, [name]: null }));
  };

  // Gestion upload fichier local → base64
  const handleFileChange = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErreurs(er => ({ ...er, image: 'Image trop lourde (max 5 Mo)' }));
      return;
    }
    const base64 = await fileToBase64(file);
    setImagePreview(base64);
    setForm(f => ({ ...f, image: base64 }));
    if (erreurs.image) setErreurs(er => ({ ...er, image: null }));
  };

  const clearImage = () => {
    setImagePreview(null);
    setForm(f => ({ ...f, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const valider = () => {
    const er = {};
    if (!form.title.trim())       er.title = 'Le titre est requis';
    if (!form.short.trim())       er.short = 'Le résumé est requis';
    if (!form.description.trim()) er.description = 'La description est requise';
    return er;
  };

  const toArr = s => s.split(',').map(x => x.trim()).filter(Boolean);

  const handleSubmit = async e => {
    e.preventDefault();
    const er = valider();
    if (Object.keys(er).length > 0) { setErreurs(er); return; }
    setSubmitting(true);
    try {
      await onAjouter({
        ...form,
        tags:        toArr(form.tags),
        features:    toArr(form.features),
        awsServices: toArr(form.awsServices),
        image:       form.image.trim() || null,
      });
      setForm(initialState);
      setImagePreview(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h3><i className="fa-solid fa-plus-circle" /> Ajouter un nouveau projet</h3>

      <div className="form-grid">
        <div className="field">
          <label>Titre *</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Ex : Mon super projet" />
          {erreurs.title && <small className="err">{erreurs.title}</small>}
        </div>
        <div className="field">
          <label>Type *</label>
          <select name="type" value={form.type} onChange={handleChange}>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Statut</label>
          <select name="status" value={form.status} onChange={handleChange}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="field">
          <label>GitHub</label>
          <input name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/…" />
        </div>
        <div className="field full">
          <label>Résumé court *</label>
          <input name="short" value={form.short} onChange={handleChange} placeholder="Une phrase qui résume le projet" />
          {erreurs.short && <small className="err">{erreurs.short}</small>}
        </div>
        <div className="field full">
          <label>Description *</label>
          <textarea name="description" rows="3" value={form.description} onChange={handleChange} placeholder="Description complète du projet" />
          {erreurs.description && <small className="err">{erreurs.description}</small>}
        </div>
        <div className="field full">
          <label>Tags / Technologies (séparés par des virgules)</label>
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
        </div>
        <div className="field full">
          <label>Fonctionnalités (séparées par des virgules)</label>
          <input name="features" value={form.features} onChange={handleChange} placeholder="CRUD, Auth JWT, Upload…" />
        </div>
        <div className="field full">
          <label>Services AWS (séparés par des virgules)</label>
          <input name="awsServices" value={form.awsServices} onChange={handleChange} placeholder="EC2, S3, Lambda" />
        </div>

        {/* ── Champ image avec double mode ── */}
        <div className="field full">
          <label>Image du projet</label>

          {/* Sélecteur de mode */}
          <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.6rem' }}>
            <button type="button"
              className={imageMode === 'url' ? 'chip active' : 'chip'}
              onClick={() => { setImageMode('url'); clearImage(); }}>
              <i className="fa-solid fa-link" /> URL
            </button>
            <button type="button"
              className={imageMode === 'local' ? 'chip active' : 'chip'}
              onClick={() => { setImageMode('local'); setForm(f => ({ ...f, image: '' })); }}>
              <i className="fa-solid fa-upload" /> Fichier local
            </button>
          </div>

          {/* Mode URL */}
          {imageMode === 'url' && (
            <input name="image" value={form.image} onChange={handleChange}
              placeholder="/assets/image.jpg ou https://…" />
          )}

          {/* Mode fichier local */}
          {imageMode === 'local' && (
            <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
              {imagePreview ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={imagePreview} alt="Aperçu"
                    style={{ maxHeight: 160, maxWidth: '100%', borderRadius: '.5rem', display: 'block' }} />
                  <button type="button" onClick={e => { e.stopPropagation(); clearImage(); }}
                    style={{ position: 'absolute', top: 4, right: 4, background: '#dc2626', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', fontSize: '.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ✕
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8' }}>
                  <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '2rem', display: 'block', marginBottom: '.5rem' }} />
                  <span style={{ fontSize: '.85rem' }}>Cliquez ou glissez une image ici</span>
                  <br /><small style={{ fontSize: '.75rem' }}>JPG, PNG, WEBP, AVIF — max 5 Mo</small>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*"
                style={{ display: 'none' }} onChange={handleFileChange} />
            </div>
          )}
          {erreurs.image && <small className="err">{erreurs.image}</small>}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-ghost" onClick={onAnnuler}>Annuler</button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          <i className="fa-solid fa-check" />
          {submitting ? 'Enregistrement…' : 'Enregistrer le projet'}
        </button>
      </div>
    </form>
  );
}
