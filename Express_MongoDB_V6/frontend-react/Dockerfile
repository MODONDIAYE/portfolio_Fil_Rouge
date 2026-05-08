# ════════════════════════════════════════════
# ÉTAPE 1 — Build React avec Node.js
# ════════════════════════════════════════════
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les dépendances en premier (cache Docker)
COPY package*.json ./
RUN npm install

# Copier le code source et builder
COPY . .
RUN npm run build
# → produit /app/dist/

# ════════════════════════════════════════════
# ÉTAPE 2 — Servir avec Nginx (image ~40Mo)
# ════════════════════════════════════════════
FROM nginx:alpine

# Copier les fichiers buildés depuis l'étape 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la config Nginx (proxy + SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
