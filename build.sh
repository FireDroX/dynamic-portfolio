#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"
# Built and pushed by the CI workflow (.github/workflows/ci.yml) on every
# merge to main. The package is public, so pulling needs no login.
IMAGE="ghcr.io/firedrox/portfolio-image:latest"

cd "${SCRIPT_DIR}"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Erreur : fichier .env introuvable (${ENV_FILE})." >&2
  exit 1
fi

# L'image est publique : aucun login n'est nécessaire. Un ancien `docker
# login ghcr.io` fait avec un token éphémère du workflow resterait sinon
# dans ~/.docker/config.json et ferait échouer le pull en "unauthorized"
# une fois le token expiré.
docker logout ghcr.io > /dev/null 2>&1 || true

# Le DNS de la machine expire parfois en plein pull : on retente avant
# d'abandonner. Le conteneur en place n'est remplacé qu'après un pull réussi.
echo "Pull de l'image..."
for attempt in 1 2 3 4 5; do
  if docker pull "${IMAGE}"; then
    break
  fi
  if (( attempt == 5 )); then
    echo "Erreur : pull impossible après ${attempt} tentatives, conteneur actuel conservé." >&2
    exit 1
  fi
  echo "Pull échoué (tentative ${attempt}/5), nouvel essai dans $(( attempt * 10 ))s..." >&2
  sleep $(( attempt * 10 ))
done

echo "Remplacement du conteneur existant..."
docker rm -f portfolio 2>/dev/null || true

# Réseaux :
#  - APP_NETWORK : réseau normal, propre au portfolio. Sert au port publié
#    (Docker ne publie pas de port sur un réseau --internal) et à la sortie
#    Internet. Aucun autre conteneur dessus.
#  - DB_NETWORK  : réseau --internal partagé uniquement avec MariaDB. Le
#    portfolio ne voit donc plus les autres conteneurs (wiki, phpmyadmin...).
APP_NETWORK="network-portfolio"
DB_NETWORK="db-portfolio"
DB_CONTAINER="mariadb"

if ! docker network inspect "${APP_NETWORK}" > /dev/null 2>&1; then
  docker network create "${APP_NETWORK}" > /dev/null
fi
if [[ "$(docker network inspect -f '{{.Internal}}' "${APP_NETWORK}")" == "true" ]]; then
  echo "Erreur : ${APP_NETWORK} est --internal, le port 3333 ne serait pas publié." >&2
  exit 1
fi
if ! docker network inspect "${DB_NETWORK}" > /dev/null 2>&1; then
  docker network create --internal "${DB_NETWORK}" > /dev/null
fi
# MariaDB doit être joignable sur le réseau dédié (idempotent).
if ! docker inspect -f '{{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}' "${DB_CONTAINER}" \
    | tr ' ' '\n' | grep -qx "${DB_NETWORK}"; then
  docker network connect "${DB_NETWORK}" "${DB_CONTAINER}"
fi

echo "Lancement du conteneur..."
# create + network connect + start : compatible avec toutes les versions de
# Docker (plusieurs --network sur docker run nécessitent Docker >= 25).
docker create \
  --init \
  --env-file "${ENV_FILE}" \
  -p 127.0.0.1:3333:3000 \
  --network "${APP_NETWORK}" \
  --name portfolio \
  --restart unless-stopped \
  -v portfolio_projects:/app/projects \
  "${IMAGE}" > /dev/null
docker network connect "${DB_NETWORK}" portfolio
docker start portfolio > /dev/null

# Chaque déploiement laisse l'image précédente orpheline (<none>) :
# sans nettoyage elles s'accumulent sur le disque.
echo "Nettoyage des anciennes images..."
docker image prune -f

echo "Logs du conteneur..."
docker logs --tail 50 portfolio

echo "Portfolio redémarré."
