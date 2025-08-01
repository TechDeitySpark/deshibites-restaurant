#!/bin/bash

# DeshiBites Deployment Script for EC2
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
IMAGE_NAME="deshibites-app"
CONTAINER_NAME="deshibites-app"

echo "🚀 Starting deployment for $ENVIRONMENT environment..."

# Build Docker image
echo "📦 Building Docker image..."
docker build -t $IMAGE_NAME:latest .

# Stop and remove existing container
echo "🛑 Stopping existing container..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Run new container
echo "▶️ Starting new container..."
docker run -d \
  --name $CONTAINER_NAME \
  -p 80:80 \
  -p 443:443 \
  --restart unless-stopped \
  $IMAGE_NAME:latest

# Wait for container to be healthy
echo "🏥 Checking container health..."
sleep 10

if docker ps | grep -q $CONTAINER_NAME; then
    echo "✅ Deployment successful! Container is running."
    echo "🌐 Application is available at: http://localhost"
else
    echo "❌ Deployment failed! Container is not running."
    echo "📋 Container logs:"
    docker logs $CONTAINER_NAME
    exit 1
fi

# Clean up unused images
echo "🧹 Cleaning up unused images..."
docker image prune -f

echo "🎉 Deployment completed successfully!"
