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

## 📋 Plan de commits GitHub (~20 commits)

### Phase 1 — Initialisation
```
commit 01 — init: initialisation du projet et structure des dossiers
commit 02 — feat: ajout de index.html (point d'entrée SPA)
commit 03 — feat: ajout du package.json et configuration npm
commit 04 — feat: ajout de src/css/input.css (variables et animations CSS)
```

### Phase 2 — Modules JS
```
commit 05 — feat(api): création de api.js avec données projets et CRUD localStorage
commit 06 — feat(ui): création de ui.js (navbar, toast, modal, scroll animations)
commit 07 — feat(projet): création de projet.js (rendu cartes et stats)
commit 08 — feat(gestion): création de gestionProjets.js (ajout/suppression/filtres)
commit 09 — feat(detail): création de detailProjet.js (vue détail)
commit 10 — feat(main): création de src/main.js (routeur SPA et orchestration)
```

### Phase 3 — Assets
```
commit 11 — assets: ajout des images projets dans src/assets
commit 12 — assets: ajout du CV PDF dans src/assets/docs
```

### Phase 4 — Vues
```
commit 13 — feat(vue-home): implémentation de la vue Accueil (hero, services, skills)
commit 14 — feat(vue-projets): implémentation de la vue Liste des projets
commit 15 — feat(vue-detail): implémentation de la vue Détail projet
commit 16 — feat(vue-ajouter): implémentation du formulaire d'ajout
commit 17 — feat(vue-contact): implémentation de la page Contact
```

### Phase 5 — Fonctionnalités avancées
```
commit 18 — feat(filtres): ajout des filtres par catégorie et recherche temps réel
commit 19 — feat(animations): intégration des animations scroll et skill bars
commit 20 — feat(responsive): optimisation mobile (burger menu, grilles adaptatives)
```

### Phase 6 — Finalisation
```
commit 21 — fix: correction des chemins d'images et gestion des erreurs
commit 22 — chore: ajout du README.md et documentation
```

---

## 👤 Auteur

**Modou NDIAYE**  
📧 m2243d@gmail.com  
📞 +221 78 483 11 92  
📍 Dakar, Sénégal

© 2026 — Tous droits réservés
