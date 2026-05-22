# Image de base Node.js LTS (Alpine = legere ~5Mo)
FROM node:20-alpine

# Repertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json en premier (optimise le cache Docker)
COPY package*.json ./

# Installer TOUTES les dependances (y compris devDependencies pour Jest)
# On garde les devDeps pour pouvoir lancer les tests dans le conteneur
RUN npm install

# Copier tout le code source
COPY . .

# Port expose par Express
EXPOSE 5000

# Demarrage du serveur
CMD ["node", "server.js"]