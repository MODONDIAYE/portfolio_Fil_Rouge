import React from 'react';

export default function Hero({ onVoirProjets }) {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <span className="section-label">Portfolio · React JS SPA</span>
          <h1>
            Bonjour, je suis <span className="accent">Modou NDIAYE</span>
          </h1>
          <p>
            Développeur Fullstack &amp; UI Designer basé à Dakar, Sénégal.
            Cette application est une <strong>Single Page Application React</strong> qui
            permet de gérer mes projets via une <strong>API REST factice</strong>{' '}
            (json-server) — ajout, recherche, suppression, édition.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={onVoirProjets}>
              <i className="fa-solid fa-folder-open" /> Voir mes projets
            </button>
            <a className="btn-ghost" href="/assets/CV_Modou_NIDAYE_Sysadmin_Junior(1).pdf" download>
              <i className="fa-solid fa-download" /> Télécharger le CV
            </a>
          </div>
        </div>

        <div className="hero-photo">
          <img src="/assets/profil.jpg" alt="Modou NDIAYE" />
        </div>
      </div>
    </section>
  );
}
