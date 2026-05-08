import { useState, useEffect } from 'react';
import { membersApi } from '../api/api';

export default function Membres() {
  const [membres, setMembres]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const charger = async () => {
    setLoading(true);
    try { const r = await membersApi.getAll(); setMembres(r.data || []); }
    catch { /* silencieux */ }
    setLoading(false);
  };

  useEffect(() => { charger(); }, []);

  const flash = msg => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const supprimer = async (id) => {
    if (!window.confirm('Supprimer ce membre ?')) return;
    await membersApi.remove(id);
    setMembres(prev => prev.filter(m => m._id !== id));
    if (selected?._id === id) setSelected(null);
    flash('🗑️ Membre supprimé.');
  };

  return (
    <section className="dossier-section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">L'Équipe</span>
          <h2 className="section-title">Membres du Portfolio</h2>
          <div className="section-divider" />
          <p className="section-subtitle">{membres.length} membre{membres.length > 1 ? 's' : ''} enregistré{membres.length > 1 ? 's' : ''}.</p>
        </div>

        <div className="toolbar">
          <button className="btn-primary" onClick={() => { setEditTarget(null); setShowForm(s => !s); }}>
            <i className={`fa-solid ${showForm && !editTarget ? 'fa-xmark' : 'fa-plus'}`} />
            {showForm && !editTarget ? 'Fermer' : 'Ajouter un membre'}
          </button>
        </div>

        {successMsg && <p className="success-msg">{successMsg}</p>}

        {showForm && (
          <MembreForm
            initial={editTarget}
            onSaved={async (data) => {
              if (editTarget) {
                const r = await membersApi.update(editTarget._id, data);
                setMembres(prev => prev.map(m => m._id === editTarget._id ? r.data : m));
                flash('✅ Membre modifié.');
              } else {
                const r = await membersApi.create(data);
                setMembres(prev => [...prev, r.data]);
                flash('✅ Membre ajouté.');
              }
              setShowForm(false); setEditTarget(null);
            }}
            onAnnuler={() => { setShowForm(false); setEditTarget(null); }}
          />
        )}

        {loading ? (
          <p className="info"><i className="fa-solid fa-spinner fa-spin" /> Chargement…</p>
        ) : membres.length === 0 ? (
          <div className="empty">
            <i className="fa-solid fa-users" />
            <p>Aucun membre. Lancez le seed : <code>node seed.js</code></p>
          </div>
        ) : (
          <div className="members-grid">
            {membres.map(m => (
              <div key={m._id} className="member-card">
                <div className="member-avatar">
                  {m.avatar ? <img src={m.avatar} alt={m.name} /> : '👤'}
                </div>
                <div className="member-name">{m.name}</div>
                <div className="member-role">{m.role}</div>
                {m.specialty && <div className="member-specialty">{m.specialty}</div>}
                {m.bio && <div className="member-bio">{m.bio.slice(0, 90)}{m.bio.length > 90 ? '…' : ''}</div>}
                {m.skills?.length > 0 && (
                  <div className="member-skills">
                    {m.skills.slice(0, 5).map(s => <span key={s} className="tech">{s}</span>)}
                  </div>
                )}
                <div className="member-actions">
                  <button className="btn-detail btn-sm" onClick={() => setSelected(m)}>
                    <i className="fa-regular fa-eye" /> Voir
                  </button>
                  <button className="btn-edit btn-sm" onClick={() => { setEditTarget(m); setShowForm(true); }}>
                    <i className="fa-solid fa-pen" />
                  </button>
                  <button className="btn-delete btn-sm" onClick={() => supprimer(m._id)}>
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal détail */}
        {selected && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}
            onClick={() => setSelected(null)}>
            <div className="detail-card" style={{ maxWidth: 500, width: '100%', marginTop: 0 }} onClick={e => e.stopPropagation()}>
              <div className="detail-head">
                <div>
                  <span className="section-label">Profil membre</span>
                  <h2>{selected.name}</h2>
                  <p className="meta"><span className="badge-mini">{selected.role}</span></p>
                </div>
                <button className="btn-ghost btn-sm" onClick={() => setSelected(null)}>✕</button>
              </div>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div className="member-avatar" style={{ width: 90, height: 90, fontSize: '2.5rem', margin: '0 auto 1rem' }}>
                  {selected.avatar ? <img src={selected.avatar} alt={selected.name} /> : '👤'}
                </div>
                {selected.specialty && <p style={{ color: '#64748b', fontSize: '.88rem' }}>{selected.specialty}</p>}
              </div>
              {selected.bio && <p style={{ color: '#475569', fontSize: '.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>{selected.bio}</p>}
              {selected.skills?.length > 0 && (
                <div className="techs-large" style={{ marginBottom: '1rem' }}>
                  {selected.skills.map(s => <span key={s} className="tech">{s}</span>)}
                </div>
              )}
              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                {selected.github   && <a href={selected.github}   target="_blank" rel="noreferrer" className="btn-ghost btn-sm"><i className="fa-brands fa-github" /> GitHub</a>}
                {selected.linkedin && <a href={selected.linkedin} target="_blank" rel="noreferrer" className="btn-ghost btn-sm"><i className="fa-brands fa-linkedin" /> LinkedIn</a>}
                {selected.email    && <a href={`mailto:${selected.email}`} className="btn-ghost btn-sm"><i className="fa-solid fa-envelope" /> Email</a>}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function MembreForm({ initial, onSaved, onAnnuler }) {
  const empty = { name: '', role: '', specialty: '', bio: '', github: '', linkedin: '', email: '', skills: '' };
  const [form, setForm] = useState(initial ? { ...initial, skills: initial.skills?.join(', ') || '' } : empty);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true); setErr('');
    try {
      await onSaved({ ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) });
    } catch (e) { setErr(e.response?.data?.message || 'Erreur.'); }
    setSaving(false);
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h3><i className="fa-solid fa-user-plus" /> {initial ? 'Modifier le membre' : 'Ajouter un membre'}</h3>
      {err && <p className="error">{err}</p>}
      <div className="form-grid">
        <div className="field"><label>Nom *</label><input value={form.name} onChange={e => set('name', e.target.value)} required /></div>
        <div className="field"><label>Rôle *</label><input value={form.role} onChange={e => set('role', e.target.value)} required /></div>
        <div className="field"><label>Spécialité</label><input value={form.specialty} onChange={e => set('specialty', e.target.value)} /></div>
        <div className="field"><label>Email</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
        <div className="field"><label>GitHub</label><input value={form.github} onChange={e => set('github', e.target.value)} /></div>
        <div className="field"><label>LinkedIn</label><input value={form.linkedin} onChange={e => set('linkedin', e.target.value)} /></div>
        <div className="field full"><label>Bio</label><textarea rows="3" value={form.bio} onChange={e => set('bio', e.target.value)} /></div>
        <div className="field full"><label>Compétences (séparées par des virgules)</label><input value={form.skills} onChange={e => set('skills', e.target.value)} placeholder="React, Node.js, AWS" /></div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-ghost" onClick={onAnnuler}>Annuler</button>
        <button type="submit" className="btn-primary" disabled={saving}>
          <i className="fa-solid fa-check" /> {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}
