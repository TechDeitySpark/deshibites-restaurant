# 🐳 DeshiBites Docker Deployment Guide

This guide covers deploying your DeshiBites restaurant application using Docker to AWS EC2.

## 📋 Prerequisites

- AWS EC2 instance (t2.micro or larger)
- Docker Hub account
- GitHub account
- Domain name (optional)

## 🚀 Deployment Options

### Option 1: GitHub Actions (Recommended)

1. **Setup GitHub Secrets:**
   ```
   DOCKER_USERNAME=your-dockerhub-username
   DOCKER_PASSWORD=your-dockerhub-password
   DOCKER_REGISTRY=your-dockerhub-username
   EC2_HOST=your-ec2-public-ip
   EC2_USERNAME=ec2-user
   EC2_SSH_KEY=your-private-key-content
   DB_ROOT_PASSWORD=your-strong-password
   DB_NAME=deshibites_db
   DB_USER=deshibites_user
   DB_PASSWORD=your-db-password
   ```

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add Docker deployment"
   git push origin main
   ```

3. **Automatic Deployment:**
   - GitHub Actions will automatically build, test, and deploy
   - Check the Actions tab for deployment status

### Option 2: Jenkins Pipeline

1. **Setup Jenkins Credentials:**
   - `docker-registry`: Docker Hub username
   - `docker-hub-credentials`: Docker Hub username/password
   - `ec2-host`: EC2 public IP
   - `ec2-ssh-key`: SSH private key for EC2

2. **Create Jenkins Pipeline:**
   - New Item → Pipeline
   - Pipeline script from SCM
   - Repository URL: your-github-repo
   - Script Path: Jenkinsfile

3. **Run Pipeline:**
   - Build Now to trigger deployment

### Option 3: Manual Deployment

1. **Prepare EC2 Instance:**
   ```bash
   # Copy setup script to EC2
   scp scripts/setup-ec2.sh ec2-user@your-ec2-ip:~
   
   # Run setup script
   ssh ec2-user@your-ec2-ip
   chmod +x setup-ec2.sh
   ./setup-ec2.sh
   ```

2. **Deploy Application:**
   ```bash
   # Local build and push
   docker build -t your-username/deshibites-app:latest .
   docker push your-username/deshibites-app:latest
   
   # Copy deployment script
   scp scripts/deploy.sh ec2-user@your-ec2-ip:~
   
   # Deploy on EC2
   ssh ec2-user@your-ec2-ip
   chmod +x deploy.sh
   ./deploy.sh production
   ```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database
DB_ROOT_PASSWORD=your-strong-password
DB_NAME=deshibites_db
DB_USER=deshibites_user
DB_PASSWORD=your-db-password

# Application
NODE_ENV=production
REACT_APP_API_URL=https://your-domain.com/api

# AWS (for deployment)
AWS_REGION=us-east-1
```

### SSL/HTTPS Setup (Optional)

1. **Install Certbot:**
   ```bash
   sudo yum install -y certbot python3-certbot-nginx
   ```

2. **Get SSL Certificate:**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. **Auto-renewal:**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

## 📊 Monitoring

### Health Checks

- **Application**: `http://your-domain.com/`
- **Docker Status**: `docker ps`
- **Logs**: `docker logs deshibites-app`

### Performance Monitoring

```bash
# Resource usage
docker stats

# Application logs
docker logs -f deshibites-app

# System resources
htop
```

## 🛠️ Maintenance

### Updates

```bash
# Pull latest code
git pull origin main

# Rebuild and deploy
./scripts/deploy.sh production
```

### Backup Database

```bash
# Backup
docker exec mysql-container mysqldump -u root -p deshibites_db > backup.sql

# Restore
docker exec -i mysql-container mysql -u root -p deshibites_db < backup.sql
```

### Scaling

For high traffic, consider:
- Load balancer (Application Load Balancer)
- Multiple EC2 instances
- RDS for database
- CloudFront for static assets

## 🚨 Troubleshooting

### Common Issues

1. **Port 80 in use:**
   ```bash
   sudo lsof -i :80
   sudo kill -9 PID
   ```

2. **Container won't start:**
   ```bash
   docker logs deshibites-app
   docker exec -it deshibites-app /bin/sh
   ```

3. **Permission denied:**
   ```bash
   sudo usermod -a -G docker $USER
   # Log out and back in
   ```

### Support

- Check GitHub Issues
- Review deployment logs
- Verify environment variables
- Test locally first

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Database backed up
- [ ] Monitoring setup
- [ ] Log rotation configured
- [ ] Security groups configured
- [ ] Domain DNS pointed to EC2
- [ ] Health checks passing

---

Your DeshiBites application is now ready for production deployment! 🎉
