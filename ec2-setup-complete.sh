#!/bin/bash

# Complete EC2 Setup Script for DeshiBites
# Run this script on your fresh EC2 instance (Amazon Linux 2)

set -e

echo "🚀 Setting up EC2 instance for DeshiBites deployment..."

# Update system
echo "📦 Updating system packages..."
sudo yum update -y

# Install Docker
echo "🐳 Installing Docker..."
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group
sudo usermod -a -G docker $USER

# Install Docker Compose
echo "🐙 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
echo "📚 Installing Git..."
sudo yum install -y git

# Install Node.js (for potential future use)
echo "📗 Installing Node.js..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install useful utilities
echo "🔧 Installing utilities..."
sudo yum install -y wget curl vim htop

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/deshibites
sudo chown $USER:$USER /opt/deshibites

# Create environment file template
echo "📄 Creating environment file..."
cat > /opt/deshibites/.env << 'EOF'
# Application Configuration
NODE_ENV=production
PORT=3000

# Security (change these if you add authentication later!)
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-super-secret-session-key-here
EOF

# Set up log rotation for Docker
echo "📝 Setting up log rotation..."
sudo mkdir -p /etc/docker
cat | sudo tee /etc/docker/daemon.json << 'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

# Restart Docker to apply log settings
sudo systemctl restart docker

# Configure firewall
echo "🔥 Configuring firewall..."
sudo systemctl start firewalld || true
sudo firewall-cmd --permanent --add-port=80/tcp || true
sudo firewall-cmd --permanent --add-port=443/tcp || true
sudo firewall-cmd --permanent --add-port=3000/tcp || true
sudo firewall-cmd --reload || true

# Create swap file for better performance (useful for t2.micro)
echo "💾 Creating swap file..."
if [ ! -f /swapfile ]; then
    sudo fallocate -l 1G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

# Create deployment script
echo "🚀 Creating deployment script..."
cat > /opt/deshibites/deploy.sh << 'EOF'
#!/bin/bash

# Deployment script for DeshiBites
set -e

DOCKER_REGISTRY="${DOCKER_REGISTRY:-techdeity}"
IMAGE_NAME="deshibites-app"
COMPOSE_FILE="/opt/deshibites/docker-compose.prod.yml"

echo "🚀 Starting DeshiBites deployment..."

# Navigate to application directory
cd /opt/deshibites

# Pull latest images
echo "📥 Pulling latest Docker images..."
docker pull ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f ${COMPOSE_FILE} down || true

# Start new containers
echo "▶️ Starting new containers..."
docker-compose -f ${COMPOSE_FILE} up -d

# Show status
echo "📊 Container status:"
docker-compose -f ${COMPOSE_FILE} ps

echo "✅ Deployment completed!"
echo "🌐 Your application should be available at: http://$(curl -s ifconfig.me):3000"
EOF

chmod +x /opt/deshibites/deploy.sh

# Create production docker-compose file
echo "📄 Creating production docker-compose file..."
cat > /opt/deshibites/docker-compose.prod.yml << 'EOF'
version: '3.8'

services:
  frontend:
    image: ${DOCKER_REGISTRY:-techdeity}/deshibites-app:latest
    ports:
      - "80:80"
      - "3000:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
EOF

echo "✅ EC2 setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Logout and login again to apply Docker group membership"
echo "2. Configure your .env file in /opt/deshibites/"
echo "3. Test Docker: docker run hello-world"
echo "4. Your deployment script is ready at: /opt/deshibites/deploy.sh"
echo ""
echo "🚀 To deploy your application, the GitHub Actions will automatically:"
echo "   - Build and push Docker image"
echo "   - Deploy to this EC2 instance"
echo ""
echo "📱 After deployment, access your app at: http://$(curl -s ifconfig.me):3000"
