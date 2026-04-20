#!/bin/bash

echo "🛑 Stop container si existant..."
docker stop portfolio 2>/dev/null

echo "🗑️ Suppression container..."
docker rm portfolio 2>/dev/null

echo "📦 Build image..."
DOCKER_BUILDKIT=1 docker build -t portfolio-image .

echo "🚀 Lancement container..."
docker run -d \
  -p 3000:3000 \
  --name portfolio \
  -v portfolio_projects:/app/projects \
  portfolio-image:latest

echo "✅ Done ! Portfolio restarted."