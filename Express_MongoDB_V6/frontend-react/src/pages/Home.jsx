import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsApi, membersApi, healthApi } from '../api/api';

export default function Home() {
  const [stats, setStats]   = useState(null);
  const [health, setHealth] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      projectsApi.getStats().catch(() => null),
      healthApi.check().catch(() => null),
      membersApi.getAll().catch(() => ({ data: [] })),
    ]).then(([s, h, m]) => {
      setStats(s?.data);
      setHealth(h);
      setMembers(m?.data?.slice(0, 4) || []);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="page">
      <div className="loading"><div className="loading-spinner" /><p>Chargement…</p></div>
    </div>
  );

  return (
    <div className="page">
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '3rem 0 2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '.75rem' }}>
          Portfolio <span style={{ color: 'var(--green)' }}>Modou NDIAYE</span>
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto 2rem' }}>
          Plateforme de présentation des projets et membres du groupe G2 — AWS P5
        </p>
        {health && (
          <span className="badge badge-green" style={{ fontSize: '.85rem', padding: '.3rem .9rem' }}>
            ✅ API opérationnelle — v{health.version}
          </span>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          <div className="stat-card">
            <div className="stat-icon">📁</div>
            <div><div className="stat-value">{stats.total}</div><div className="stat-label">Projets total</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div><div className="stat-value" style={{ color: 'var(--orange)' }}>{stats.enCours}</div><div className="stat-label">En cours</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div><div className="stat-value">{stats.termines}</div><div className="stat-label">Terminés</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div><div className="stat-value" style={{ color: 'var(--muted)' }}>{stats.archives}</div><div className="stat-label">Archivés</div></div>
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        <Link to="/projects" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>📁</div>
            <h3 style={{ marginBottom: '.5rem' }}>Projets</h3>
            <p style={{ color: 'var(--muted)', fontSize: '.88rem' }}>Découvrez tous les projets réalisés par l'équipe</p>
          </div>
        </Link>
        <Link to="/members" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>👥</div>
            <h3 style={{ marginBottom: '.5rem' }}>Équipe</h3>
            <p style={{ color: 'var(--muted)', fontSize: '.88rem' }}>Rencontrez les membres du portfolio de Modou NDIAYE</p>
          </div>
        </Link>
        <Link to="/contact" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>✉️</div>
            <h3 style={{ marginBottom: '.5rem' }}>Contact</h3>
            <p style={{ color: 'var(--muted)', fontSize: '.88rem' }}>Envoyez-nous un message</p>
          </div>
        </Link>
      </div>

      {/* Members preview */}
      {members.length > 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>👥 L'équipe</h2>
            <Link to="/members" className="btn btn-secondary btn-sm">Voir tous →</Link>
          </div>
          <div className="grid-4">
            {members.map(m => (
              <div key={m._id} className="card member-card">
                <div className="member-avatar">
                  {m.avatar ? <img src={m.avatar} alt={m.name} /> : '👤'}
                </div>
                <div className="member-name">{m.name}</div>
                <div className="member-role">{m.role}</div>
                {m.specialty && <div style={{ fontSize: '.78rem', color: 'var(--muted)' }}>{m.specialty}</div>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
