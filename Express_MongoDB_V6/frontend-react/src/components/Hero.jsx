export default function Hero({ onVoirProjets }) {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <span className="section-label">Portfolio · Express JS &amp; MongoDB</span>
          <h1>
            Bonjour, je suis <span className="accent">Modou NDIAYE</span>
          </h1>
          <p>
            Développeur Fullstack basé à Dakar, Sénégal.
            Cette application est une <strong>SPA React</strong> connectée à une{' '}
            <strong>API REST Express.js</strong> et une base de données{' '}
            <strong>MongoDB Atlas</strong> — CRUD complet en temps réel.
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
          <img src="/assets/profil.jpg" alt="Modou NDIAYE"
            onError={e => e.currentTarget.style.display = 'none'} />
        </div>
      </div>
    </section>
  );
}
