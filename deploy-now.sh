#!/bin/bash

# DeshiBites Deployment Command
# Run this script to deploy your application

set -e

echo "🍽️ DeshiBites Deployment Script"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Pre-deployment Checklist:${NC}"
echo "1. ✅ EC2 instance is running"
echo "2. ✅ GitHub secrets are configured"
echo "3. ✅ Docker Hub account is ready"
echo "4. ✅ SSH key is configured"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -f "frontend/package.json" ]; then
    echo -e "${RED}❌ Error: Not in DeshiBites project directory${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${YELLOW}🚀 Starting deployment process...${NC}"

# Add all changes
echo -e "${BLUE}📦 Adding changes to Git...${NC}"
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo -e "${YELLOW}ℹ️ No changes to commit, proceeding with existing code...${NC}"
else
    # Commit changes
    echo -e "${BLUE}💾 Committing changes...${NC}"
    COMMIT_MSG="Deploy DeshiBites - $(date '+%Y-%m-%d %H:%M:%S')"
    git commit -m "$COMMIT_MSG"
fi

# Push to GitHub
echo -e "${BLUE}⬆️ Pushing to GitHub...${NC}"
git push origin main

echo -e "${GREEN}✅ Code pushed to GitHub!${NC}"
echo ""
echo -e "${YELLOW}🔄 GitHub Actions is now building and deploying your application...${NC}"
echo ""
echo -e "${BLUE}📊 Monitor deployment progress:${NC}"
echo "1. Go to: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\).*/\1/' | sed 's/.git$//')/actions"
echo "2. Watch the 'Deploy to EC2' workflow"
echo ""
echo -e "${BLUE}⏱️ Deployment typically takes 5-10 minutes${NC}"
echo ""
echo -e "${GREEN}🌐 Once complete, your app will be available at:${NC}"
echo "http://YOUR-EC2-IP:3000"
echo ""
echo -e "${YELLOW}📱 Don't forget to:${NC}"
echo "1. Update your security group to allow port 3000"
echo "2. Configure your domain (if you have one)"
echo "3. Set up SSL certificate for production"
echo ""
echo -e "${GREEN}🎉 Deployment initiated successfully!${NC}"
