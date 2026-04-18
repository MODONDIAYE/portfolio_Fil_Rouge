import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <h3><span className="logo-accent">Modou</span> NDIAYE</h3>
          <p>Développeur Fullstack — Portfolio SPA construite avec React JS &amp; json-server.</p>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li><i className="fa-solid fa-envelope" /> modoundiaye@example.com</li>
            <li><i className="fa-solid fa-location-dot" /> Dakar, Sénégal</li>
            <li><i className="fa-brands fa-github" /> github.com/modoundiaye</li>
          </ul>
        </div>
      </div>
      <p className="copy">© {new Date().getFullYear()} Modou NDIAYE — Projet Fil Rouge React JS</p>
    </footer>
  );
}
