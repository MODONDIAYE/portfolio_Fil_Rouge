# ── Image de base Node.js LTS (Alpine = légère ~5Mo)
FROM node:20-alpine

# ── Répertoire de travail dans le conteneur
WORKDIR /app

# ── Copier package.json en premier (optimise le cache Docker)
# Si package.json n'a pas changé → npm install est mis en cache
COPY package*.json ./

# ── Installer uniquement les dépendances de production
RUN npm install --omit=dev

# ── Copier tout le code source
COPY . .

# ── Port exposé par Express
EXPOSE 5000

# ── Démarrage du serveur
CMD ["node", "server.js"]
