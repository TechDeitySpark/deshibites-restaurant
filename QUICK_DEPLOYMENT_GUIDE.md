# 🚀 DeshiBites Quick Deployment Guide

## Prerequisites
- AWS EC2 instance (t2.micro or larger)
- Docker Hub account
- GitHub account
- SSH key pair for EC2

## 📋 Step-by-Step Deployment

### 1. Setup EC2 Instance

**Launch EC2 Instance:**
- AMI: Amazon Linux 2
- Instance Type: t2.micro (free tier) or larger
- Security Group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 3000 (App)

**Connect to EC2 and run setup:**
```bash
# Copy the setup script to your EC2
scp -i your-key.pem ec2-setup-complete.sh ec2-user@your-ec2-ip:~/

# SSH into EC2
ssh -i your-key.pem ec2-user@your-ec2-ip

# Run setup script
chmod +x ec2-setup-complete.sh
./ec2-setup-complete.sh

# Logout and login again for Docker group membership
exit
ssh -i your-key.pem ec2-user@your-ec2-ip
```

### 2. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password  
DOCKER_REGISTRY=your-dockerhub-username
EC2_HOST=your-ec2-public-ip
EC2_USERNAME=ec2-user
EC2_SSH_KEY=your-private-key-content
```

### 3. Deploy Application

**Push to GitHub:**
```bash
git add .
git commit -m "Deploy DeshiBites to EC2"
git push origin main
```

**Monitor Deployment:**
- Go to GitHub → Actions tab
- Watch the deployment pipeline
- Deployment takes ~5-10 minutes

### 4. Access Your Application

Once deployed, access your app at:
```
http://your-ec2-public-ip:3000
```

## 🔧 Useful Commands

**Check deployment status on EC2:**
```bash
cd /opt/deshibites
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs
```

**Manual deployment (if needed):**
```bash
cd /opt/deshibites
./deploy.sh
```

**View application logs:**
```bash
docker logs deshibites_frontend_1
```

## 🚨 Troubleshooting

**If deployment fails:**
1. Check GitHub Actions logs
2. SSH into EC2 and check Docker status: `sudo systemctl status docker`
3. Check container logs: `docker-compose logs`
4. Restart deployment: `./deploy.sh`

**If website doesn't load:**
1. Check Security Group allows port 3000
2. Check if containers are running: `docker ps`
3. Check application logs: `docker logs <container-name>`

## 🔄 Updates

To update your application:
1. Make changes to your code
2. Commit and push to main branch
3. GitHub Actions will automatically rebuild and deploy

## 📱 Features Available

After deployment, your DeshiBites app will have:
- ✅ React frontend with restaurant interface
- ✅ Admin dashboard
- ✅ Multilingual support
- ✅ Shopping cart functionality
- ✅ Static data management
- ✅ Automatic SSL (if domain configured)
- ✅ Health monitoring
- ✅ Auto-restart on failure

## 🎯 Next Steps

1. **Configure Domain** (optional):
   - Point your domain to EC2 IP
   - Update nginx config for SSL

2. **Data Management**:
   - Configure your static menu data
   - Update multilingual content
   - Set up admin users (if authentication is added)

3. **Monitoring**:
   - Setup CloudWatch
   - Configure log monitoring

---

🎉 **Congratulations!** Your DeshiBites restaurant application is now live!
