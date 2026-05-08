import { useState } from 'react';

export default function Navbar({ vue, setVue }) {
  const [open, setOpen] = useState(false);

  const go = (v) => {
    setVue(v);
    setOpen(false);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  return (
    <header className="navbar">
      <nav className="container nav-inner">
        <a href="#" onClick={(e) => { e.preventDefault(); go('accueil'); }} className="logo">
          <span className="logo-accent">Modou</span> NDIAYE
        </a>

        <div className={`nav-links ${open ? 'open' : ''}`}>
          <a href="#" onClick={(e) => { e.preventDefault(); go('accueil'); }} className={vue === 'accueil' ? 'active' : ''}>Accueil</a>
          <a href="#" onClick={(e) => { e.preventDefault(); go('projets'); }} className={vue === 'projets' ? 'active' : ''}>Projets</a>
          <a href="#" onClick={(e) => { e.preventDefault(); go('membres'); }} className={vue === 'membres' ? 'active' : ''}>Équipe</a>
          <a href="#" onClick={(e) => { e.preventDefault(); go('contact'); }} className={vue === 'contact' ? 'active' : ''}>Contact</a>
        </div>

        <button className="burger" onClick={() => setOpen(o => !o)} aria-label="Menu">
          <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`} />
        </button>
      </nav>
    </header>
  );
}
