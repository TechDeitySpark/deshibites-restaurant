#!/bin/bash

# EC2 Server Setup Script
# Run this on your EC2 instance to prepare it for deployment

set -e

echo "🔧 Setting up EC2 instance for DeshiBites deployment..."

# Update system
echo "📦 Updating system packages..."
sudo yum update -y

# Install Docker
echo "🐳 Installing Docker..."
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -a -G docker $USER

# Install Docker Compose
echo "🐙 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
echo "📚 Installing Git..."
sudo yum install -y git

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/deshibites
sudo chown $USER:$USER /opt/deshibites

# Install Node.js (for potential backend services)
echo "📗 Installing Node.js..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Configure firewall (if needed)
echo "🔥 Configuring firewall..."
sudo systemctl start firewalld || true
sudo firewall-cmd --permanent --add-port=80/tcp || true
sudo firewall-cmd --permanent --add-port=443/tcp || true
sudo firewall-cmd --permanent --add-port=3000/tcp || true
sudo firewall-cmd --reload || true

# Create swap file (recommended for small instances)
echo "💾 Creating swap file..."
if [ ! -f /swapfile ]; then
    sudo fallocate -l 1G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

echo "✅ EC2 setup completed successfully!"
echo "🔄 Please log out and log back in for group changes to take effect."
echo "🚀 Your server is ready for DeshiBites deployment!"
