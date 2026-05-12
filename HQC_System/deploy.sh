#!/bin/bash

# HQC System Deployment Script
# Usage: ./deploy.sh

set -e

echo "🚀 Starting HQC System Deployment..."

# 1. Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.prod.example to .env and fill in your secrets."
    exit 1
fi

# 2. Update code (optional, assumes already cloned)
# git pull origin main

# 3. Build and Start Services
echo "📦 Building and starting containers..."
docker compose -f docker-compose.prod.yml up -d --build

# 4. Run Migrations
echo "🔄 Running backend migrations..."
docker exec hqc-system-backend-prod alembic upgrade head

# 5. Seed Admin (Optional)
# echo "👤 Seeding admin user..."
# docker exec hqc-system-backend-prod python scripts/seed_admin_user.py

echo "✅ Deployment completed successfully!"
echo "Dashboard is running on port 80"
echo "API is running on port 8000 (proxied via Nginx /api)"
