import React, { useState } from 'react';
import Dossier from './components/Dossier.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Footer from './components/Footer.jsx';

/**
 * App — Composant racine de la SPA Portfolio.
 * Articule la navigation entre la Vue Accueil et le Dossier (gestion des projets).
 */
export default function App() {
  const [vue, setVue] = useState('accueil'); // 'accueil' | 'dossier'

  return (
    <div className="app">
      <Navbar vue={vue} setVue={setVue} />

      <main>
        {vue === 'accueil' ? (
          <>
            <Hero onVoirProjets={() => setVue('dossier')} />
            <Dossier />
          </>
        ) : (
          <Dossier />
        )}
      </main>

      <Footer />
    </div>
  );
}
