# Étape 1: Construire l'application Angular
# Utiliser une image Node.js comme base pour la construction de l'application Angular
FROM node:18-alpine as build-step

# Définir le répertoire de travail dans l'image
WORKDIR /app

# Copier les fichiers de dépendances et installer les dépendances
COPY package*.json /app/
RUN npm install

# Copier le reste des fichiers de l'application
COPY . /app

# Construire l'application Angular
RUN npm run build:prod

# Étape 2: Exécuter l'application Node.js
# Utiliser une autre image Node.js pour exécuter l'application
FROM node:18-alpine

# Définir le répertoire de travail dans l'image
WORKDIR /app

# Copier les fichiers de dépendances et installer seulement les dépendances de production
COPY package*.json /app/
RUN npm install --only=production

# Copier les fichiers de l'application Node.js
COPY --from=build-step /app/dist /app/dist

# Exposer le port sur lequel l'application Node.js va s'exécuter
EXPOSE 4200

# Définir la commande pour exécuter l'application
CMD ["npm", "run", "start:prod"]

