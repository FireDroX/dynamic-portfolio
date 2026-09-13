#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"
# Built and pushed by the CI workflow (.github/workflows/ci.yml) on every
# merge to main. Requires `docker login ghcr.io` on this host beforehand
# if the package is private (the deploy workflow does this for you).
IMAGE="ghcr.io/firedrox/portfolio-image:latest"

cd "${SCRIPT_DIR}"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Erreur : fichier .env introuvable (${ENV_FILE})." >&2
  exit 1
fi

echo "Pull de l'image..."
docker pull "${IMAGE}"

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
  "${IMAGE}"

echo "Logs du conteneur..."
docker logs --tail 50 portfolio

echo "Portfolio redémarré."
