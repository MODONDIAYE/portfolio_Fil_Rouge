import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import { projectsApi, membersApi } from '../api/api';

export default function Accueil({ setVue }) {
  const [stats, setStats]     = useState(null);
  const [membres, setMembres] = useState([]);

  useEffect(() => {
    projectsApi.getStats().then(r => setStats(r.data)).catch(() => {});
    membersApi.getAll().then(r => setMembres(r.data?.slice(0, 4) || [])).catch(() => {});
  }, []);

  return (
    <>
      <Hero onVoirProjets={() => setVue('projets')} />

      <section className="dossier-section" style={{ paddingTop: '3rem' }}>
        <div className="container">

          {/* Stats */}
          {stats && (
            <>
              <div className="section-header">
                <span className="section-label">Vue d'ensemble</span>
                <h2 className="section-title">Statistiques</h2>
                <div className="section-divider" />
              </div>
              <div className="stats-grid" style={{ marginBottom: '3rem' }}>
                <div className="stat-card">
                  <div className="stat-icon"><i className="fa-solid fa-layer-group" style={{ color: '#0f1e3c', fontSize: '1.6rem' }} /></div>
                  <div><div className="stat-value">{stats.total}</div><div className="stat-label">Projets total</div></div>
                </div>
                <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
                  <div className="stat-icon"><i className="fa-solid fa-spinner" style={{ color: '#d97706', fontSize: '1.6rem' }} /></div>
                  <div><div className="stat-value" style={{ color: '#d97706' }}>{stats.enCours}</div><div className="stat-label">En cours</div></div>
                </div>
                <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
                  <div className="stat-icon"><i className="fa-solid fa-circle-check" style={{ color: '#059669', fontSize: '1.6rem' }} /></div>
                  <div><div className="stat-value" style={{ color: '#059669' }}>{stats.termines}</div><div className="stat-label">Terminés</div></div>
                </div>
                <div className="stat-card" style={{ borderLeftColor: '#64748b' }}>
                  <div className="stat-icon"><i className="fa-solid fa-box-archive" style={{ color: '#64748b', fontSize: '1.6rem' }} /></div>
                  <div><div className="stat-value" style={{ color: '#64748b' }}>{stats.archives}</div><div className="stat-label">Archivés</div></div>
                </div>
              </div>
            </>
          )}

          {/* Membres preview */}
          {membres.length > 0 && (
            <>
              <div className="section-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                  <span className="section-label">L'Équipe</span>
                  <h2 className="section-title">Membres</h2>
                  <div className="section-divider" />
                </div>
                <button className="btn-ghost btn-sm" onClick={() => setVue('membres')}>
                  Voir tous <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
              <div className="members-grid">
                {membres.map(m => (
                  <div key={m._id} className="member-card">
                    <div className="member-avatar">
                      {m.avatar ? <img src={m.avatar} alt={m.name} /> : '👤'}
                    </div>
                    <div className="member-name">{m.name}</div>
                    <div className="member-role">{m.role}</div>
                    {m.specialty && <div className="member-specialty">{m.specialty}</div>}
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </section>
    </>
  );
}
