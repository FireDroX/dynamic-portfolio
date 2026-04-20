# ----------- 1. Build React -----------
FROM node:20-slim AS client-build

WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client/ .
RUN npm run build


# ----------- 2. Backend -----------
FROM node:20-slim

WORKDIR /app

# 🔧 dépendances système nécessaires pour canvas
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    && rm -rf /var/lib/apt/lists/*

# Installer dépendances backend
COPY package*.json ./
RUN npm install

# Copier le code backend
COPY . .

# Copier build React
COPY --from=client-build /app/client/build ./client/build

# Volume persistant
VOLUME ["/app/projects"]

# Port
EXPOSE 3000

# Lancer serveur
CMD ["node", "server.js"]