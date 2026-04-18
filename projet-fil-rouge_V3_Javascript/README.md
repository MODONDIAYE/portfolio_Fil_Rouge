# Portfolio — Modou NDIAYE

> Portfolio professionnel SPA (Single Page Application) en JavaScript Vanilla + Tailwind CSS.

## 🚀 Aperçu

Portfolio interactif présentant les projets, compétences et expériences de **Modou NDIAYE**, Développeur Fullstack & UI Designer basé à Dakar, Sénégal.

## 📁 Architecture

```
projet-fil-rouge/
├── index.html              # Point d'entrée SPA
├── package.json            # Configuration npm
├── README.md               # Documentation
├── public/                 # Ressources publiques statiques
└── src/
    ├── main.js             # Orchestration & routeur SPA
    ├── assets/             # Images des projets
    ├── css/
    │   ├── input.css       # CSS source (Tailwind + custom)
    │   └── output.css      # CSS compilé Tailwind
    └── js/
        ├── api.js          # Persistance localStorage (CRUD)
        ├── projet.js       # Rendu des cartes projets
        ├── gestionProjets.js # Ajout / suppression / filtres
        ├── detailProjet.js  # Vue détail d'un projet
        └── ui.js           # Navbar, toast, modal, animations
```

## ⚙️ Installation

```bash
# Cloner le projet
git clone https://github.com/modoundiaye/portfolio-v3.git
cd portfolio-v3

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Compiler le CSS Tailwind
npm run build:css
```

## 🌐 Fonctionnalités

- **SPA** : Navigation par hash sans rechargement de page
- **CRUD Projets** : Ajout, affichage, détail et suppression
- **Filtres** : Recherche en temps réel + filtre par catégorie
- **Persistance** : localStorage (simulation API REST)
- **Animations** : Entrées au scroll, skill bars animées, hover effects
- **Responsive** : Mobile-first avec Tailwind CSS
- **Notifications** : Toast + modal de confirmation

## 🛠️ Technologies

- JavaScript ES6 Modules
- Tailwind CSS v3
- HTML5 sémantique
- localStorage API
- CSS Animations

---


---

## 👤 Auteur

**Modou NDIAYE**  
📧 m2243d@gmail.com  
📞 +221 78 483 11 92  
📍 Dakar, Sénégal

© 2026 — Tous droits réservés
