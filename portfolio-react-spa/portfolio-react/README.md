# Portfolio React SPA — Modou NDIAYE

Application Web **Single Page Application (SPA)** de gestion de portfolio développée avec **React JS** et persistée via une **API REST factice** (`json-server`).

## 🎯 Exigences couvertes

- ✅ SPA React JS prototypée et décomposée en composants
- ✅ Composant **`Dossier`** — gère (stocke / charge / ajoute / recherche / supprime / édite) la liste des projets
- ✅ Composant **`Projet`** — affiche le libellé, l'image, et un bouton « Supprimer »
- ✅ Composant **`AjouterProjet`** — formulaire d'ajout d'un projet
- ✅ Suppression d'un projet
- ✅ Composant **`DetaillerProjet`** — affichage complet d'un projet, avec boutons « Annuler » et « Editer »
- ✅ Le **libellé** d'un projet sur la liste est une **ancre cliquable** ouvrant ses détails
- ✅ Persistance via **`json-server`** + fichier **`db.json`** fourni

## 🏗️ Architecture des composants

```
App
 ├── Navbar
 ├── Hero
 ├── Dossier                ← gestion centralisée des projets (état + CRUD)
 │    ├── AjouterProjet     ← formulaire d'ajout
 │    ├── Projet (xN)       ← carte + bouton "Supprimer" + libellé-ancre
 │    └── DetaillerProjet   ← détail + boutons "Annuler" / "Editer"
 └── Footer
```

## 🚀 Installation & lancement

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer json-server (API REST factice) + Vite (frontend) en parallèle
npm start
```

Cette commande lance :
- l'API REST factice sur **http://localhost:3001/projets** (json-server)
- l'application React sur **http://localhost:5173** (Vite)

### Lancer les services séparément

```bash
npm run server   # json-server uniquement (port 3001)
npm run dev      # Vite uniquement (port 5173)
```

## 🔌 API REST (json-server)

| Méthode | Endpoint              | Description           |
|---------|-----------------------|-----------------------|
| GET     | `/projets`            | Liste tous les projets |
| GET     | `/projets/:id`        | Détail d'un projet     |
| POST    | `/projets`            | Ajoute un projet       |
| PUT     | `/projets/:id`        | Met à jour un projet   |
| DELETE  | `/projets/:id`        | Supprime un projet     |

Données initiales : voir **`db.json`** (6 projets pré-chargés).

## 🗂️ Structure du projet

```
portfolio-react-spa/
├── db.json                    ← données json-server
├── index.html
├── package.json
├── vite.config.js
├── public/assets/             ← images & CV (récupérés du portfolio original)
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles.css
    ├── services/
    │   └── api.js             ← appels axios vers json-server
    └── components/
        ├── Navbar.jsx
        ├── Hero.jsx
        ├── Footer.jsx
        ├── Dossier.jsx        ← composant central
        ├── Projet.jsx
        ├── AjouterProjet.jsx
        └── DetaillerProjet.jsx
```

## 🛠️ Stack technique

- **React 18** + Hooks (`useState`, `useEffect`, `useMemo`)
- **Vite** (bundler/dev-server)
- **Axios** (client HTTP)
- **json-server** (API REST factice)
- CSS pur (design system inspiré du portfolio original)
