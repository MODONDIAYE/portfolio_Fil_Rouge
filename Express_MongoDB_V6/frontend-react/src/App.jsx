import { useState } from 'react';
import Navbar   from './components/Navbar';
import Footer   from './components/Footer';
import Accueil  from './pages/Accueil';
import Projets  from './pages/Projets';
import Membres  from './pages/Membres';
import Contact  from './pages/Contact';
import './index.css';

export default function App() {
  const [vue, setVue] = useState('accueil');

  const renderPage = () => {
    switch (vue) {
      case 'projets': return <Projets />;
      case 'membres': return <Membres />;
      case 'contact': return <Contact />;
      default:        return <Accueil setVue={setVue} />;
    }
  };

  return (
    <div className="app">
      <Navbar vue={vue} setVue={setVue} />
      <main>{renderPage()}</main>
      <Footer />
    </div>
  );
}
