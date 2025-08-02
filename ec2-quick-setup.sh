#!/bin/bash

# Quick EC2 Setup Commands
# Copy and paste these commands one by one into your EC2 terminal

echo "🚀 DeshiBites EC2 Quick Setup"
echo "============================="

# Update system
echo "📦 Updating system..."
sudo yum update -y

# Install Docker
echo "🐳 Installing Docker..."
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
echo "🐙 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create app directory
echo "📁 Creating app directory..."
sudo mkdir -p /opt/deshibites
sudo chown ec2-user:ec2-user /opt/deshibites

# Install utilities
echo "🔧 Installing utilities..."
sudo yum install -y wget curl vim

# Test Docker (after relogging)
echo "✅ Setup complete! Please run these commands:"
echo "1. exit"
echo "2. ssh back into EC2"
echo "3. docker --version"
echo "4. docker-compose --version"

echo ""
echo "🎯 After setup, GitHub Actions can deploy your app!"
