# ===========================================
# DOCKERFILE BACKEND NESTJS
# ===========================================

FROM node:22-alpine

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le reste du code source
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Exposer le port
EXPOSE 3000

# Commande par défaut (sera override par docker-compose)
CMD ["npm", "run", "dev"]
