#!/bin/bash

# Simple DeshiBites Deployment (Frontend Only)
# Run this script to deploy your React application

set -e

echo "🍽️ DeshiBites Frontend Deployment"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying React Frontend Application${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo -e "${RED}❌ Error: frontend/package.json not found${NC}"
    echo "Please run this script from the DeshiBites project root directory"
    exit 1
fi

echo -e "${BLUE}📋 Required GitHub Secrets (make sure these are configured):${NC}"
echo "• DOCKER_USERNAME - Your Docker Hub username"
echo "• DOCKER_PASSWORD - Your Docker Hub password"
echo "• DOCKER_REGISTRY - Your Docker Hub username"
echo "• EC2_HOST - Your EC2 public IP address"
echo "• EC2_USERNAME - ec2-user"
echo "• EC2_SSH_KEY - Your private SSH key content"
echo ""

read -p "Have you configured all GitHub secrets? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Please configure GitHub secrets first, then run this script again.${NC}"
    echo -e "${BLUE}Go to: https://github.com/TechDeitySpark/deshibites-restaurant/settings/secrets/actions${NC}"
    exit 1
fi

echo -e "${YELLOW}🔄 Preparing deployment...${NC}"

# Add all changes
echo -e "${BLUE}📦 Adding changes to Git...${NC}"
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo -e "${YELLOW}ℹ️ No changes to commit, deploying existing code...${NC}"
else
    # Commit changes
    echo -e "${BLUE}💾 Committing changes...${NC}"
    COMMIT_MSG="Deploy frontend-only DeshiBites - $(date '+%Y-%m-%d %H:%M:%S')"
    git commit -m "$COMMIT_MSG"
fi

# Push to GitHub
echo -e "${BLUE}⬆️ Pushing to GitHub (this will trigger deployment)...${NC}"
git push origin main

echo ""
echo -e "${GREEN}✅ Deployment initiated successfully!${NC}"
echo ""
echo -e "${YELLOW}📊 Monitor your deployment:${NC}"
echo "1. GitHub Actions: https://github.com/TechDeitySpark/deshibites-restaurant/actions"
echo "2. Watch the 'Deploy to EC2' workflow"
echo ""
echo -e "${BLUE}⏱️ Deployment Process:${NC}"
echo "1. 🧪 Run tests (2-3 minutes)"
echo "2. 🐳 Build Docker image (3-5 minutes)"
echo "3. 📤 Push to Docker Hub (1-2 minutes)"
echo "4. 🚀 Deploy to EC2 (2-3 minutes)"
echo ""
echo -e "${GREEN}🌐 Your app will be available at:${NC}"
echo "• http://YOUR-EC2-IP (port 80)"
echo "• http://YOUR-EC2-IP:3000 (port 3000)"
echo ""
echo -e "${YELLOW}📱 After deployment:${NC}"
echo "• Test your restaurant interface"
echo "• Check admin dashboard functionality"
echo "• Verify menu display and cart features"
echo ""
echo -e "${BLUE}🔧 Troubleshooting:${NC}"
echo "• If deployment fails, check GitHub Actions logs"
echo "• SSH to EC2: ssh -i your-key.pem ec2-user@YOUR-EC2-IP"
echo "• Check containers: docker ps"
echo "• View logs: docker logs <container-name>"
echo ""
echo -e "${GREEN}🎉 Happy deploying!${NC}"
