import { useEffect, useState } from 'react';
import { projectsApi } from '../api/api';

const TYPES   = ['Tous', 'Web', 'Mobile', 'Desktop', 'API', 'Cloud', 'DevOps', 'IA', 'Autre'];
const STATUSES = ['Tous', 'En cours', 'Terminé', 'Archivé'];

const statusBadge = (s) => {
  if (s === 'Terminé')  return 'badge-green';
  if (s === 'En cours') return 'badge-orange';
  return 'badge-gray';
};

const typeEmoji = { Web:'🌐', Mobile:'📱', Desktop:'🖥️', API:'⚙️', Cloud:'☁️', DevOps:'🔧', IA:'🤖', Autre:'📦' };

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [typeFilter, setType]   = useState('Tous');
  const [statusFilter, setStatus] = useState('Tous');
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [alert, setAlert]       = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (typeFilter !== 'Tous') params.type = typeFilter;
      if (statusFilter !== 'Tous') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();
      const res = await projectsApi.getAll(params);
      setProjects(res.data || []);
    } catch { setError('Impossible de charger les projets.'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [typeFilter, statusFilter]);

  const handleSearch = (e) => { e.preventDefault(); load(); };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce projet ?')) return;
    try {
      await projectsApi.remove(id);
      showAlert('Projet supprimé.', 'success');
      setSelected(null);
      load();
    } catch { showAlert('Erreur lors de la suppression.', 'error'); }
  };

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>📁 Projets</h1>
          <p>{projects.length} projet{projects.length > 1 ? 's' : ''} trouvé{projects.length > 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditTarget(null); setShowForm(true); }}>
          + Nouveau projet
        </button>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      {/* Filters */}
      <div className="filters">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '.5rem', flex: 1 }}>
          <input className="form-control search-input" placeholder="🔍 Rechercher…" value={search} onChange={e => setSearch(e.target.value)} />
          <button type="submit" className="btn btn-secondary">Chercher</button>
        </form>
      </div>
      <div className="filters">
        {TYPES.map(t => (
          <button key={t} className={`filter-btn${typeFilter === t ? ' active' : ''}`} onClick={() => setType(t)}>
            {typeEmoji[t] || ''} {t}
          </button>
        ))}
      </div>
      <div className="filters">
        {STATUSES.map(s => (
          <button key={s} className={`filter-btn${statusFilter === s ? ' active' : ''}`} onClick={() => setStatus(s)}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading"><div className="loading-spinner" /><p>Chargement…</p></div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : projects.length === 0 ? (
        <div className="empty"><div className="empty-icon">📭</div><p>Aucun projet trouvé.</p></div>
      ) : (
        <div className="grid-3">
          {projects.map(p => (
            <div key={p._id} className="card project-card">
              {p.image
                ? <img src={p.image} alt={p.title} className="project-card-img" onError={e => e.target.style.display='none'} />
                : <div className="project-card-img-placeholder">{typeEmoji[p.type] || '📦'}</div>
              }
              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-blue">{p.type}</span>
                <span className={`badge ${statusBadge(p.status)}`}>{p.status}</span>
              </div>
              <div className="project-card-title">{p.title}</div>
              <div className="project-card-short">{p.short}</div>
              {p.tags?.length > 0 && (
                <div className="tags">{p.tags.slice(0, 4).map(t => <span key={t} className="tag">{t}</span>)}</div>
              )}
              <div className="project-card-footer">
                <button className="btn btn-secondary btn-sm" onClick={() => setSelected(p)}>Voir détails</button>
                <div className="project-card-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => { setEditTarget(p); setShowForm(true); }}>✏️</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selected.title}</h2>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            {selected.image && <img src={selected.image} alt={selected.title} className="detail-img" onError={e => e.target.style.display='none'} />}
            <div className="detail-meta" style={{ marginBottom: '1.5rem' }}>
              <span className="badge badge-blue">{selected.type}</span>
              <span className={`badge ${statusBadge(selected.status)}`}>{selected.status}</span>
              {selected.awsServices?.map(s => <span key={s} className="badge badge-orange">{s}</span>)}
            </div>
            <div className="detail-section">
              <h3>Description</h3>
              <p style={{ color: 'var(--muted)', fontSize: '.9rem', lineHeight: 1.7 }}>{selected.description}</p>
            </div>
            {selected.features?.length > 0 && (
              <div className="detail-section">
                <h3>Fonctionnalités</h3>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--muted)', fontSize: '.88rem' }}>
                  {selected.features.map((f, i) => <li key={i} style={{ marginBottom: '.3rem' }}>{f}</li>)}
                </ul>
              </div>
            )}
            {selected.tags?.length > 0 && (
              <div className="detail-section">
                <h3>Technologies</h3>
                <div className="tags">{selected.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
              </div>
            )}
            {selected.members?.length > 0 && (
              <div className="detail-section">
                <h3>Membres</h3>
                <div className="tags">{selected.members.map(m => <span key={m} className="badge badge-blue">{m}</span>)}</div>
              </div>
            )}
            <div className="detail-links">
              {selected.github && <a href={selected.github} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">🐙 GitHub</a>}
              {selected.demo   && <a href={selected.demo}   target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">🚀 Démo</a>}
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ProjectForm
          initial={editTarget}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
          onSaved={() => { setShowForm(false); setEditTarget(null); load(); showAlert(editTarget ? 'Projet modifié.' : 'Projet créé.', 'success'); }}
        />
      )}
    </div>
  );
}

/* ── Project Form ─────────────────────────────────── */
function ProjectForm({ initial, onClose, onSaved }) {
  const empty = { title: '', short: '', description: '', type: 'Web', status: 'En cours', tags: '', github: '', demo: '', features: '', awsServices: '', members: '' };
  const [form, setForm] = useState(initial
    ? { ...initial, tags: initial.tags?.join(', ') || '', features: initial.features?.join(', ') || '', awsServices: initial.awsServices?.join(', ') || '', members: initial.members?.join(', ') || '' }
    : empty
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toArr = (s) => s.split(',').map(x => x.trim()).filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setErr('');
    const payload = { ...form, tags: toArr(form.tags), features: toArr(form.features), awsServices: toArr(form.awsServices), members: toArr(form.members) };
    try {
      if (initial) await projectsApi.update(initial._id, payload);
      else         await projectsApi.create(payload);
      onSaved();
    } catch (e) {
      const msg = e.response?.data?.message
        || e.response?.data?.error
        || e.message
        || 'Erreur lors de la sauvegarde.';
      setErr(`❌ ${msg}`);
      console.error('Erreur création projet:', e.response?.data || e.message);
    }
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initial ? '✏️ Modifier le projet' : '➕ Nouveau projet'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {err && <div className="alert alert-error">{err}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Titre *</label>
              <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Type *</label>
              <select className="form-control" value={form.type} onChange={e => set('type', e.target.value)}>
                {['Web','Mobile','Desktop','API','Cloud','DevOps','IA','Autre'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Statut</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                {['En cours','Terminé','Archivé'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>GitHub</label>
              <input className="form-control" value={form.github} onChange={e => set('github', e.target.value)} placeholder="https://github.com/…" />
            </div>
            <div className="form-group full">
              <label>Résumé court *</label>
              <input className="form-control" value={form.short} onChange={e => set('short', e.target.value)} required />
            </div>
            <div className="form-group full">
              <label>Description *</label>
              <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} required />
            </div>
            <div className="form-group full">
              <label>Tags (séparés par des virgules)</label>
              <input className="form-control" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="React, Node.js, MongoDB" />
            </div>
            <div className="form-group full">
              <label>Fonctionnalités (séparées par des virgules)</label>
              <input className="form-control" value={form.features} onChange={e => set('features', e.target.value)} />
            </div>
            <div className="form-group full">
              <label>Services AWS (séparés par des virgules)</label>
              <input className="form-control" value={form.awsServices} onChange={e => set('awsServices', e.target.value)} placeholder="EC2, S3, Lambda" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Enregistrement…' : '💾 Enregistrer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
