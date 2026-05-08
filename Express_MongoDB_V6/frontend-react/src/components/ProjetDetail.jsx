import { useState, useEffect, useRef } from 'react';

const TYPES    = ['Web', 'Mobile', 'Desktop', 'API', 'Cloud', 'DevOps', 'IA', 'Autre'];
const STATUSES = ['En cours', 'Terminé', 'Archivé'];

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function ProjetDetail({ projet, modeEdition, onAnnuler, onEditer, onAnnulerEdition, onEnregistrer }) {
  const [form, setForm]           = useState(projet);
  const [imageMode, setImageMode] = useState('url');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Détecter si l'image existante est base64 ou URL
    const isBase64 = projet.image?.startsWith('data:');
    setImageMode(isBase64 ? 'local' : 'url');
    setImagePreview(isBase64 ? projet.image : null);
    setForm({
      ...projet,
      tags:        Array.isArray(projet.tags)        ? projet.tags.join(', ')        : projet.tags || '',
      features:    Array.isArray(projet.features)    ? projet.features.join(', ')    : projet.features || '',
      awsServices: Array.isArray(projet.awsServices) ? projet.awsServices.join(', ') : projet.awsServices || '',
      members:     Array.isArray(projet.members)     ? projet.members.join(', ')     : projet.members || '',
    });
  }, [projet, modeEdition]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFileChange = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setImagePreview(base64);
    setForm(f => ({ ...f, image: base64 }));
  };

  const clearImage = () => {
    setImagePreview(null);
    setForm(f => ({ ...f, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toArr = s => (typeof s === 'string' ? s.split(',').map(x => x.trim()).filter(Boolean) : s || []);

  const handleSave = e => {
    e.preventDefault();
    onEnregistrer({
      ...form,
      tags:        toArr(form.tags),
      features:    toArr(form.features),
      awsServices: toArr(form.awsServices),
      members:     toArr(form.members),
    });
  };

  // ── Mode lecture ──────────────────────────────────────────────────────────
  if (!modeEdition) {
    return (
      <div className="detail-card">
        <div className="detail-head">
          <div>
            <span className="section-label">Détails du projet</span>
            <h2>{projet.title}</h2>
            <p className="meta">
              <span className="badge-mini">{projet.type}</span>
              <span className="badge-mini" style={{ background: projet.status === 'Terminé' ? '#059669' : projet.status === 'Archivé' ? '#64748b' : '#d97706' }}>
                {projet.status}
              </span>
            </p>
          </div>
          <div className="detail-actions">
            <button className="btn-ghost" onClick={onAnnuler}>
              <i className="fa-solid fa-xmark" /> Fermer
            </button>
            <button className="btn-primary" onClick={onEditer}>
              <i className="fa-solid fa-pen" /> Éditer
            </button>
          </div>
        </div>

        <div className="detail-body">
          {projet.image && (
            <img className="detail-img" src={projet.image} alt={projet.title}
              onError={e => e.currentTarget.style.display = 'none'} />
          )}
          <div className="detail-text">
            <h4>Description</h4>
            <p>{projet.description}</p>

            {projet.features?.length > 0 && (
              <>
                <h4>Fonctionnalités</h4>
                <ul style={{ paddingLeft: '1.2rem', color: '#475569', fontSize: '.9rem' }}>
                  {projet.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </>
            )}

            <h4>Technologies</h4>
            <div className="techs-large">
              {(projet.tags || []).map(t => <span key={t} className="tech">{t}</span>)}
            </div>

            {projet.awsServices?.length > 0 && (
              <>
                <h4>Services AWS</h4>
                <div className="techs-large">
                  {projet.awsServices.map(s => (
                    <span key={s} className="tech" style={{ background: '#fef3c7', color: '#b45309' }}>{s}</span>
                  ))}
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              {projet.github && (
                <a className="btn-primary" href={projet.github} target="_blank" rel="noreferrer">
                  <i className="fa-brands fa-github" /> GitHub
                </a>
              )}
              {projet.demo && (
                <a className="btn-ghost" href={projet.demo} target="_blank" rel="noreferrer">
                  <i className="fa-solid fa-arrow-up-right-from-square" /> Démo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Mode édition ──────────────────────────────────────────────────────────
  return (
    <form className="detail-card" onSubmit={handleSave}>
      <div className="detail-head">
        <div>
          <span className="section-label">Édition du projet</span>
          <h2>Modifier : {projet.title}</h2>
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

      <div className="form-grid">
        <div className="field">
          <label>Titre *</label>
          <input name="title" value={form.title || ''} onChange={handleChange} required />
        </div>
        <div className="field">
          <label>Type *</label>
          <select name="type" value={form.type || 'Web'} onChange={handleChange}>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Statut</label>
          <select name="status" value={form.status || 'En cours'} onChange={handleChange}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="field">
          <label>GitHub</label>
          <input name="github" value={form.github || ''} onChange={handleChange} placeholder="https://github.com/…" />
        </div>
        <div className="field full">
          <label>Résumé court *</label>
          <input name="short" value={form.short || ''} onChange={handleChange} required />
        </div>
        <div className="field full">
          <label>Description *</label>
          <textarea name="description" rows="3" value={form.description || ''} onChange={handleChange} required />
        </div>
        <div className="field full">
          <label>Tags / Technologies (séparés par des virgules)</label>
          <input name="tags" value={form.tags || ''} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
        </div>
        <div className="field full">
          <label>Fonctionnalités (séparées par des virgules)</label>
          <input name="features" value={form.features || ''} onChange={handleChange} />
        </div>
        <div className="field full">
          <label>Services AWS (séparés par des virgules)</label>
          <input name="awsServices" value={form.awsServices || ''} onChange={handleChange} placeholder="EC2, S3, Lambda" />
        </div>

        {/* ── Champ image avec double mode ── */}
        <div className="field full">
          <label>Image du projet</label>
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

          {imageMode === 'url' && (
            <input name="image" value={form.image || ''} onChange={handleChange}
              placeholder="/assets/image.jpg ou https://…" />
          )}

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
        </div>
      </div>
    </form>
  );
}
