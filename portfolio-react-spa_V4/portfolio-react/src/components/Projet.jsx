import React from 'react';

/**
 * Projet — Composant carte projet.
 * Affiche le libellé (cliquable = ancre vers DetaillerProjet), l'image et un bouton "Supprimer".
 */
const COULEURS = {
  Web: '#3b82f6',
  App: '#a855f7',
  'UI/UX': '#ec4899',
  Mobile: '#10b981',
  'E-commerce': '#f97316',
  Santé: '#14b8a6',
};

export default function Projet({ projet, onSupprimer, onAfficherDetail }) {
  const couleur = COULEURS[projet.categorie] || '#64748b';

  const date = projet.date
    ? new Date(projet.date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <article className="card">
      <div className="card-img">
        <img
          src={projet.image || `https://placehold.co/600x400/1a2f5a/f59e0b?text=${encodeURIComponent(projet.nom)}`}
          alt={projet.nom}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/600x400/1a2f5a/f59e0b?text=${encodeURIComponent(projet.nom)}`;
          }}
        />
        <span className="badge" style={{ background: couleur }}>
          {projet.categorie}
        </span>
      </div>

      <div className="card-body">
        {/* Libellé = ancre cliquable qui ouvre les détails */}
        <a
          href={`#detail-${projet.id}`}
          className="card-title"
          onClick={(e) => {
            e.preventDefault();
            onAfficherDetail(projet);
          }}
        >
          {projet.nom}
        </a>

        {date && (
          <p className="card-date">
            <i className="fa-regular fa-calendar" /> {date}
          </p>
        )}

        <div className="card-techs">
          {(projet.technologies || []).slice(0, 4).map((t) => (
            <span key={t} className="tech">{t}</span>
          ))}
          {(projet.technologies || []).length > 4 && (
            <span className="tech tech-extra">
              +{projet.technologies.length - 4}
            </span>
          )}
        </div>

        <div className="card-actions">
          <button
            className="btn-detail"
            onClick={() => onAfficherDetail(projet)}
          >
            <i className="fa-regular fa-eye" /> Détails
          </button>
          <button
            className="btn-delete"
            onClick={() => onSupprimer(projet.id)}
            title="Supprimer ce projet"
          >
            <i className="fa-solid fa-trash" /> Supprimer
          </button>
        </div>
      </div>
    </article>
  );
}
