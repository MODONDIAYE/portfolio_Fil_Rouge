# 🐳 Guide Complet — Conteneurisation du Projet Fullstack
## Express.js · React · MongoDB

> **Projet :** Portfolio Modou NDIAYE — Express_MongoDB_V6  
> **Stack :** Backend Express.js (port 5000) · Frontend React/Vite (port 5173) · MongoDB (port 27017)  
> **Auteur :** Modou NDIAYE  
> **Date :** Mai 2026

---

## 📁 Structure des fichiers Docker à créer

```
Portfolio_ModouNDIAYE-20260329T200354Z-1-001/
├── Docker_Instructions/
│   └── DOCKER_GUIDE.md          ← ce fichier
│
└── Express_MongoDB_V6/
    ├── backend-expressJS/
    │   ├── Dockerfile            ← à créer (étape 1)
    │   ├── .dockerignore         ← à créer (étape 1)
    │   └── ...
    ├── frontend-react/
    │   ├── Dockerfile            ← à créer (étape 2)
    │   ├── .dockerignore         ← à créer (étape 2)
    │   ├── nginx.conf            ← à créer (étape 2)
    │   └── ...
    └── docker-compose.yml        ← à créer (étape 3)
```

---

## 🧠 Concepts clés avant de commencer

| Terme | Définition |
|---|---|
| **Image** | Le "plan" d'un conteneur (comme une classe en POO) |
| **Conteneur** | Une instance en cours d'exécution d'une image |
| **Dockerfile** | Fichier de recette pour construire une image |
| **docker-compose** | Outil pour orchestrer plusieurs conteneurs ensemble |
| **Volume** | Stockage persistant partagé entre l'hôte et le conteneur |
| **Network** | Réseau virtuel qui permet aux conteneurs de se parler |

---

## ✅ Prérequis

1. **Docker Desktop** installé → [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. **Docker Compose** (inclus dans Docker Desktop)
3. Vérifier l'installation :

```bash
docker --version
# Docker version 24.x.x

docker compose version
# Docker Compose version v2.x.x
```

---

## ÉTAPE 1 — Dockerfile du Backend (Express.js)

Créer le fichier `Express_MongoDB_V6/backend-expressJS/Dockerfile` :

```dockerfile
# ── Image de base : Node.js LTS (version légère Alpine)
FROM node:20-alpine

# ── Répertoire de travail dans le conteneur
WORKDIR /app

# ── Copier d'abord package.json pour profiter du cache Docker
# (si les dépendances n'ont pas changé, cette couche est réutilisée)
COPY package*.json ./

# ── Installer les dépendances de production uniquement
RUN npm install --omit=dev

# ── Copier tout le reste du code source
COPY . .

# ── Exposer le port sur lequel Express écoute
EXPOSE 5000

# ── Commande de démarrage
CMD ["node", "server.js"]
```

Créer le fichier `Express_MongoDB_V6/backend-expressJS/.dockerignore` :

```
node_modules
.env
*.log
.git
```

> ⚠️ **Important :** `.env` est exclu du conteneur volontairement.  
> Les variables d'environnement seront injectées via `docker-compose.yml`.

---

## ÉTAPE 2 — Dockerfile du Frontend (React/Vite)

Le frontend utilise un **build en deux étapes** (multi-stage build) :
- **Étape 1 :** Node.js compile le projet React → génère le dossier `dist/`
- **Étape 2 :** Nginx sert les fichiers statiques (léger et performant)

Créer le fichier `Express_MongoDB_V6/frontend-react/Dockerfile` :

```dockerfile
# ════════════════════════════════════════════
# ÉTAPE 1 : Build React avec Node.js
# ════════════════════════════════════════════
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer toutes les dépendances (y compris devDependencies pour le build)
RUN npm install

# Copier le code source
COPY . .

# Construire l'application pour la production
RUN npm run build
# → génère le dossier /app/dist/

# ════════════════════════════════════════════
# ÉTAPE 2 : Servir avec Nginx (image légère)
# ════════════════════════════════════════════
FROM nginx:alpine

# Copier les fichiers buildés depuis l'étape 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Nginx démarre automatiquement
CMD ["nginx", "-g", "daemon off;"]
```

Créer le fichier `Express_MongoDB_V6/frontend-react/nginx.conf` :

```nginx
server {
    listen 80;
    server_name localhost;

    # Dossier des fichiers statiques React
    root /usr/share/nginx/html;
    index index.html;

    # Gestion du routing React (SPA)
    # Toutes les URLs inconnues renvoient index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy vers le backend Express.js
    # /api/* → http://backend:5000/api/*
    location /api/ {
        proxy_pass         http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Compression gzip pour les performances
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

Créer le fichier `Express_MongoDB_V6/frontend-react/.dockerignore` :

```
node_modules
dist
.env
*.log
.git
```

---

## ÉTAPE 3 — docker-compose.yml (Orchestration)

Créer le fichier `Express_MongoDB_V6/docker-compose.yml` :

```yaml
version: '3.9'

# ════════════════════════════════════════════
# SERVICES
# ════════════════════════════════════════════
services:

  # ── 1. Base de données MongoDB ────────────
  mongodb:
    image: mongo:7.0          # image officielle MongoDB
    container_name: portfolio_mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"         # expose le port pour MongoDB Compass
    environment:
      MONGO_INITDB_ROOT_USERNAME: mn2243d_db_user
      MONGO_INITDB_ROOT_PASSWORD: P@sser123
      MONGO_INITDB_DATABASE: portfolio_db
    volumes:
      - mongodb_data:/data/db  # persistance des données
    networks:
      - portfolio_network

  # ── 2. Backend Express.js ─────────────────
  backend:
    build:
      context: ./backend-expressJS
      dockerfile: Dockerfile
    container_name: portfolio_backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      PORT: 5000
      NODE_ENV: production
      # Connexion à MongoDB LOCAL (conteneur mongodb)
      MONGODB_URI: mongodb://mn2243d_db_user:P%40sser123@mongodb:27017/portfolio_db?authSource=admin
      JWT_SECRET: votre_secret_jwt_tres_securise_ici
      FRONTEND_URL: http://localhost:80
    depends_on:
      - mongodb              # démarre après MongoDB
    networks:
      - portfolio_network

  # ── 3. Frontend React (Nginx) ─────────────
  frontend:
    build:
      context: ./frontend-react
      dockerfile: Dockerfile
    container_name: portfolio_frontend
    restart: unless-stopped
    ports:
      - "80:80"              # accessible sur http://localhost
    depends_on:
      - backend              # démarre après le backend
    networks:
      - portfolio_network

# ════════════════════════════════════════════
# VOLUMES (persistance des données)
# ════════════════════════════════════════════
volumes:
  mongodb_data:
    driver: local

# ════════════════════════════════════════════
# NETWORKS (réseau interne entre conteneurs)
# ════════════════════════════════════════════
networks:
  portfolio_network:
    driver: bridge
```

---

## ÉTAPE 4 — Connexion MongoDB Compass au conteneur

Une fois les conteneurs lancés, connecte MongoDB Compass avec cette URI :

```
mongodb://mn2243d_db_user:P@sser123@localhost:27017/portfolio_db?authSource=admin
```

**Étapes dans Compass :**
1. Ouvrir MongoDB Compass
2. Cliquer **"New Connection"**
3. Coller l'URI ci-dessus dans le champ de connexion
4. Cliquer **"Connect"**
5. Tu verras la base `portfolio_db` avec les collections `projects`, `members`, `contacts`

---

## 🚀 COMMANDES DOCKER — Référence complète

### Se placer dans le bon dossier

```bash
cd "C:\Users\modou\OneDrive\Documents\Portfolio_ModouNDIAYE-20260329T200354Z-1-001\Express_MongoDB_V6"
```

---

### ▶️ Construire et démarrer tous les conteneurs

```bash
# Construire les images ET démarrer les conteneurs (en arrière-plan)
docker compose up --build -d

# Explication des options :
# up         → créer et démarrer les conteneurs
# --build    → forcer la reconstruction des images (obligatoire après modification du code)
# -d         → mode détaché (les conteneurs tournent en arrière-plan)
```

**Résultat attendu :**
```
[+] Building 45.2s
 ✔ mongodb    Built
 ✔ backend    Built
 ✔ frontend   Built
[+] Running 3/3
 ✔ Container portfolio_mongodb   Started
 ✔ Container portfolio_backend   Started
 ✔ Container portfolio_frontend  Started
```

**Accès à l'application :**
- 🌐 Frontend React  → http://localhost
- ⚙️ API Backend     → http://localhost:5000/api/health
- 🍃 MongoDB Compass → mongodb://localhost:27017

---

### ⏹️ Arrêter les conteneurs (sans supprimer)

```bash
docker compose stop

# Les conteneurs sont arrêtés mais conservés
# Les données MongoDB sont préservées dans le volume
```

---

### ▶️ Redémarrer les conteneurs arrêtés

```bash
docker compose start
```

---

### 🔄 Reconstruire après modification du code

```bash
# Arrêter, reconstruire et redémarrer
docker compose down
docker compose up --build -d

# OU en une seule commande
docker compose up --build -d
```

---

### 🗑️ Supprimer les conteneurs (garder les données)

```bash
docker compose down

# Supprime : les conteneurs + le réseau
# Conserve : les images + le volume mongodb_data (données MongoDB)
```

---

### 🗑️ Supprimer les conteneurs ET les volumes (données perdues !)

```bash
docker compose down -v

# ⚠️ ATTENTION : supprime aussi le volume mongodb_data
# Toutes les données MongoDB seront PERDUES
# À utiliser uniquement pour repartir de zéro
```

---

### 🗑️ Supprimer les conteneurs, volumes ET les images

```bash
docker compose down -v --rmi all

# Supprime TOUT : conteneurs + volumes + images construites
# Utile pour libérer de l'espace disque
# Le prochain docker compose up --build reconstruira tout depuis zéro
```

---

### 📋 Voir l'état des conteneurs

```bash
docker compose ps

# Exemple de sortie :
# NAME                   STATUS          PORTS
# portfolio_mongodb      Up 2 hours      0.0.0.0:27017->27017/tcp
# portfolio_backend      Up 2 hours      0.0.0.0:5000->5000/tcp
# portfolio_frontend     Up 2 hours      0.0.0.0:80->80/tcp
```

---

### 📜 Voir les logs en temps réel

```bash
# Logs de tous les services
docker compose logs -f

# Logs d'un service spécifique
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongodb

# Dernières 50 lignes
docker compose logs --tail=50 backend
```

---

### 🔍 Entrer dans un conteneur (shell interactif)

```bash
# Entrer dans le conteneur backend
docker exec -it portfolio_backend sh

# Entrer dans le conteneur MongoDB
docker exec -it portfolio_mongodb mongosh -u mn2243d_db_user -p P@sser123

# Entrer dans le conteneur frontend (Nginx)
docker exec -it portfolio_frontend sh
```

---

### 🌱 Peupler la base de données (seed)

```bash
# Exécuter le script seed.js dans le conteneur backend
docker exec -it portfolio_backend node seed.js

# Résultat attendu :
# ✅ MongoDB connecté
# 🗑️  Collections vidées
# ✅ 5 membres insérés
# ✅ 5 projets insérés
# 🎉 Seed terminé avec succès !
```

---

## 📊 Tableau récapitulatif des commandes

| Commande | Action | Données conservées |
|---|---|---|
| `docker compose up --build -d` | Construire + démarrer | ✅ Oui |
| `docker compose stop` | Arrêter (sans supprimer) | ✅ Oui |
| `docker compose start` | Redémarrer | ✅ Oui |
| `docker compose restart` | Redémarrer tous les services | ✅ Oui |
| `docker compose down` | Supprimer conteneurs + réseau | ✅ Oui (volume intact) |
| `docker compose down -v` | Supprimer conteneurs + volumes | ❌ **Données perdues** |
| `docker compose down -v --rmi all` | Tout supprimer | ❌ **Tout perdu** |
| `docker compose logs -f` | Voir les logs | — |
| `docker compose ps` | État des conteneurs | — |

---

## 🔧 Dépannage — Problèmes fréquents

### ❌ Port déjà utilisé

```
Error: bind: address already in use :::5000
```

**Solution :**
```bash
# Windows PowerShell — trouver et tuer le processus
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Ou changer le port dans docker-compose.yml
ports:
  - "5001:5000"   # port hôte:port conteneur
```

---

### ❌ Backend ne se connecte pas à MongoDB

```
MongoServerError: Authentication failed
```

**Solution :** Vérifier que `MONGODB_URI` dans `docker-compose.yml` utilise bien `@mongodb:27017` (nom du service, pas `localhost`) :

```yaml
MONGODB_URI: mongodb://mn2243d_db_user:P%40sser123@mongodb:27017/portfolio_db?authSource=admin
```

> Dans Docker, les conteneurs se parlent via le **nom du service** défini dans `docker-compose.yml`, pas via `localhost`.

---

### ❌ Frontend affiche une page blanche

**Solution :** Vérifier que `nginx.conf` est bien copié et que le proxy `/api/` pointe vers `http://backend:5000` (nom du service Docker, pas `localhost`).

```bash
# Voir les logs Nginx
docker compose logs frontend
```

---

### ❌ Reconstruire une seule image

```bash
# Reconstruire uniquement le backend
docker compose build backend
docker compose up -d backend

# Reconstruire uniquement le frontend
docker compose build frontend
docker compose up -d frontend
```

---

### ❌ Voir les images Docker créées

```bash
docker images

# Exemple :
# REPOSITORY                    TAG       SIZE
# express_mongodb_v6-backend    latest    185MB
# express_mongodb_v6-frontend   latest    42MB
# mongo                         7.0       689MB
# nginx                         alpine    41MB
```

---

## 🏗️ Architecture des conteneurs

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                        │
│                  (portfolio_network)                     │
│                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────┐  │
│  │   Frontend   │    │   Backend    │    │  MongoDB  │  │
│  │  React/Nginx │───▶│  Express.js  │───▶│  (mongo)  │  │
│  │   port: 80   │    │  port: 5000  │    │ port:27017│  │
│  └──────────────┘    └──────────────┘    └───────────┘  │
│         │                                      │         │
└─────────┼──────────────────────────────────────┼─────────┘
          │                                      │
    http://localhost                    MongoDB Compass
    (navigateur)                        localhost:27017
```

**Flux d'une requête :**
1. Navigateur → `http://localhost` → **Nginx** (Frontend)
2. Nginx sert les fichiers React statiques
3. React fait une requête `/api/projects` → Nginx proxy → **Backend Express** (port 5000)
4. Backend Express → **MongoDB** (port 27017 interne)
5. MongoDB retourne les données → Backend → Frontend → Navigateur

---

## 📝 Workflow recommandé

```bash
# 1. Développement (sans Docker)
node server.js          # backend
npm run dev             # frontend

# 2. Test avec Docker
docker compose up --build -d
# → tester sur http://localhost

# 3. Modification du code
# → modifier les fichiers
docker compose up --build -d   # reconstruire et redémarrer

# 4. Nettoyage complet
docker compose down -v --rmi all
```

---

*Guide rédigé pour le projet Portfolio Modou NDIAYE — Express_MongoDB_V6*  
*Stack : Node.js 20 · Express.js 4 · React 19 · Vite 8 · MongoDB 7 · Nginx Alpine*
