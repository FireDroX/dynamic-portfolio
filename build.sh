#!/bin/bash

set -e

echo "📦 Build image..."
DOCKER_BUILDKIT=1 docker build -t portfolio-image .

echo "🛑 Stop container si existant..."
docker stop portfolio 2>/dev/null || true

echo "🗑️ Suppression container..."
docker rm portfolio 2>/dev/null || true

echo "🚀 Lancement container..."
docker run -d \
  -p 127.0.0.1:3000:3000 \
  --name portfolio \
  --restart unless-stopped \
  -v portfolio_projects:/app/projects \
  portfolio-image:latest

echo "📋 Logs du container..."
docker logs --tail 50 portfolio

echo "✅ Done ! Portfolio restarted."
