import { useEffect, useState } from 'react';
import { membersApi } from '../api/api';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [alert, setAlert] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const r = await membersApi.getAll(); setMembers(r.data || []); }
    catch { /* silencieux */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce membre ?')) return;
    try { await membersApi.remove(id); showAlert('Membre supprimé.', 'success'); setSelected(null); load(); }
    catch { showAlert('Erreur lors de la suppression.', 'error'); }
  };

  const showAlert = (msg, type) => { setAlert({ msg, type }); setTimeout(() => setAlert(null), 3000); };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>👥 Équipe</h1>
          <p>{members.length} membre{members.length > 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditTarget(null); setShowForm(true); }}>
          + Ajouter un membre
        </button>
      </div>

      {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

      {loading ? (
        <div className="loading"><div className="loading-spinner" /><p>Chargement…</p></div>
      ) : members.length === 0 ? (
        <div className="empty"><div className="empty-icon">👤</div><p>Aucun membre. Lancez le seed !</p><code style={{ color: 'var(--green)', fontSize: '.85rem' }}>node seed.js</code></div>
      ) : (
        <div className="grid-4">
          {members.map(m => (
            <div key={m._id} className="card member-card">
              <div className="member-avatar">
                {m.avatar ? <img src={m.avatar} alt={m.name} /> : '👤'}
              </div>
              <div className="member-name">{m.name}</div>
              <div className="member-role">{m.role}</div>
              {m.specialty && <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginBottom: '.5rem' }}>{m.specialty}</div>}
              {m.bio && <div className="member-bio" style={{ marginBottom: '.75rem' }}>{m.bio.slice(0, 80)}{m.bio.length > 80 ? '…' : ''}</div>}
              {m.skills?.length > 0 && (
                <div className="member-skills">
                  {m.skills.slice(0, 4).map(s => <span key={s} className="tag">{s}</span>)}
                </div>
              )}
              <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelected(m)}>Voir</button>
                <button className="btn btn-secondary btn-sm" onClick={() => { setEditTarget(m); setShowForm(true); }}>✏️</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m._id)}>🗑️</button>
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
              <h2>{selected.name}</h2>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div className="member-avatar" style={{ width: 90, height: 90, fontSize: '2.5rem', margin: '0 auto 1rem' }}>
                {selected.avatar ? <img src={selected.avatar} alt={selected.name} /> : '👤'}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selected.name}</div>
              <div style={{ color: 'var(--green)', fontSize: '.9rem' }}>{selected.role}</div>
              {selected.specialty && <div style={{ color: 'var(--muted)', fontSize: '.85rem', marginTop: '.25rem' }}>{selected.specialty}</div>}
            </div>
            {selected.bio && (
              <div className="detail-section">
                <h3>Bio</h3>
                <p style={{ color: 'var(--muted)', fontSize: '.9rem', lineHeight: 1.7 }}>{selected.bio}</p>
              </div>
            )}
            {selected.skills?.length > 0 && (
              <div className="detail-section">
                <h3>Compétences</h3>
                <div className="tags">{selected.skills.map(s => <span key={s} className="tag">{s}</span>)}</div>
              </div>
            )}
            <div className="detail-links">
              {selected.github   && <a href={selected.github}   target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">🐙 GitHub</a>}
              {selected.linkedin && <a href={selected.linkedin} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">💼 LinkedIn</a>}
              {selected.email    && <a href={`mailto:${selected.email}`} className="btn btn-secondary btn-sm">📧 Email</a>}
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <MemberForm
          initial={editTarget}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
          onSaved={() => { setShowForm(false); setEditTarget(null); load(); showAlert(editTarget ? 'Membre modifié.' : 'Membre ajouté.', 'success'); }}
        />
      )}
    </div>
  );
}

function MemberForm({ initial, onClose, onSaved }) {
  const empty = { name: '', role: '', specialty: '', bio: '', github: '', linkedin: '', email: '', skills: '' };
  const [form, setForm] = useState(initial
    ? { ...initial, skills: initial.skills?.join(', ') || '' }
    : empty
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setErr('');
    const payload = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) };
    try {
      if (initial) await membersApi.update(initial._id, payload);
      else         await membersApi.create(payload);
      onSaved();
    } catch (e) { setErr(e.response?.data?.message || 'Erreur.'); }
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initial ? '✏️ Modifier le membre' : '➕ Nouveau membre'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {err && <div className="alert alert-error">{err}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nom *</label>
              <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Rôle *</label>
              <input className="form-control" value={form.role} onChange={e => set('role', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Spécialité</label>
              <input className="form-control" value={form.specialty} onChange={e => set('specialty', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="form-control" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label>GitHub</label>
              <input className="form-control" value={form.github} onChange={e => set('github', e.target.value)} />
            </div>
            <div className="form-group">
              <label>LinkedIn</label>
              <input className="form-control" value={form.linkedin} onChange={e => set('linkedin', e.target.value)} />
            </div>
            <div className="form-group full">
              <label>Bio</label>
              <textarea className="form-control" value={form.bio} onChange={e => set('bio', e.target.value)} />
            </div>
            <div className="form-group full">
              <label>Compétences (séparées par des virgules)</label>
              <input className="form-control" value={form.skills} onChange={e => set('skills', e.target.value)} placeholder="React, Node.js, AWS" />
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
