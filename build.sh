#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"

cd "${SCRIPT_DIR}"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Erreur : fichier .env introuvable (${ENV_FILE})." >&2
  exit 1
fi

echo "Build de l'image..."
DOCKER_BUILDKIT=1 docker build -t portfolio-image:latest .

echo "Remplacement du conteneur existant..."
docker rm -f portfolio 2>/dev/null || true

echo "Lancement du conteneur..."
docker run -d \
  --init \
  --env-file "${ENV_FILE}" \
  -p 127.0.0.1:3333:3000 \
  --network mariadb-network \
  --name portfolio \
  --restart unless-stopped \
  -v portfolio_projects:/app/projects \
  portfolio-image:latest

echo "Logs du conteneur..."
docker logs --tail 50 portfolio

echo "Portfolio redémarré."
