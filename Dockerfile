FROM node:22-slim AS client-build

WORKDIR /build/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build


FROM node:22-slim AS backend-deps

WORKDIR /build/backend

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
      g++ \
      libcairo2-dev \
      libgif-dev \
      libjpeg-dev \
      libpango1.0-dev \
      make \
      python3 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev \
    && npm cache clean --force


FROM node:22-slim AS runtime

ENV NODE_ENV=production

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
      libcairo2 \
      libgif7 \
      libjpeg62-turbo \
      libpango-1.0-0 \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /app/projects \
    && chown -R node:node /app

COPY --from=backend-deps --chown=node:node /build/backend/node_modules ./node_modules
COPY --from=client-build --chown=node:node /build/client/build ./client/build

COPY --chown=node:node server.js config.js db.js ./
COPY --chown=node:node api ./api
COPY --chown=node:node middleware ./middleware
COPY --chown=node:node utils ./utils

USER node

VOLUME ["/app/projects"]
EXPOSE 3000

CMD ["node", "server.js"]
