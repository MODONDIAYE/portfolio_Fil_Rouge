const COULEURS = {
  Web: '#3b82f6', Mobile: '#10b981', Desktop: '#8b5cf6',
  API: '#f97316', Cloud: '#06b6d4', DevOps: '#84cc16',
  IA: '#ec4899', Autre: '#64748b',
};

const statusClass = (s) => {
  if (s === 'Terminé')  return 'status-termine';
  if (s === 'Archivé')  return 'status-archive';
  return 'status-encours';
};

export default function ProjetCard({ projet, onDetail, onEditer, onSupprimer }) {
  const couleur = COULEURS[projet.type] || '#64748b';
  const tags = projet.tags || [];

  return (
    <article className="card">
      <div className="card-img">
        <img
          src={projet.image || `https://placehold.co/600x380/1a2f5a/f59e0b?text=${encodeURIComponent(projet.title)}`}
          alt={projet.title}
          loading="lazy"
          onError={e => { e.currentTarget.src = `https://placehold.co/600x380/1a2f5a/f59e0b?text=${encodeURIComponent(projet.title)}`; }}
        />
        <span className="badge" style={{ background: couleur }}>{projet.type}</span>
        <span className={`badge-status ${statusClass(projet.status)}`}>{projet.status}</span>
      </div>

      <div className="card-body">
        <a href="#detail" className="card-title"
          onClick={e => { e.preventDefault(); onDetail(projet); }}>
          {projet.title}
        </a>

        {projet.short && <p className="card-short">{projet.short}</p>}

        <div className="card-techs">
          {tags.slice(0, 4).map(t => <span key={t} className="tech">{t}</span>)}
          {tags.length > 4 && <span className="tech tech-extra">+{tags.length - 4}</span>}
        </div>

        <div className="card-actions">
          <button className="btn-detail" onClick={() => onDetail(projet)}>
            <i className="fa-regular fa-eye" /> Détails
          </button>
          <button className="btn-edit" onClick={() => onEditer(projet)} title="Modifier">
            <i className="fa-solid fa-pen" />
          </button>
          <button className="btn-delete" onClick={() => onSupprimer(projet._id)} title="Supprimer">
            <i className="fa-solid fa-trash" />
          </button>
        </div>
      </div>
    </article>
  );
}
