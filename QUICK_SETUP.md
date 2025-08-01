# 🚀 Quick Setup Checklist - DeshiBites Docker Deployment

## ⚡ **Essential Changes You Must Make**

### **1. Environment Variables** ⚠️ CRITICAL
```bash
# Copy the example file
cp .env.example .env

# Edit .env with YOUR values:
DB_ROOT_PASSWORD=YourSecurePassword123!
DB_PASSWORD=YourDBPassword123!
DOCKER_REGISTRY=your-dockerhub-username
```

### **2. GitHub Repository Setup**
1. Create new repository on GitHub
2. Add these secrets (Settings → Secrets):
   - `DOCKER_USERNAME` = your Docker Hub username
   - `DOCKER_PASSWORD` = your Docker Hub password
   - `EC2_HOST` = your EC2 public IP
   - `EC2_SSH_KEY` = your private key content

### **3. Docker Hub Account**
1. Sign up at hub.docker.com
2. Create repository named: `deshibites-app`
3. Note your username for configuration

### **4. AWS EC2 Instance**
1. Launch Amazon Linux 2 instance
2. Open ports: 22, 80, 443
3. Download key pair (.pem file)
4. Run setup script on EC2

---

## 🔧 **File Modifications Needed**

### **Update Dockerfile** (if needed)
Current path assumes: `frontend/package.json`
If your structure is different, change:
```dockerfile
# Change this line if needed:
COPY frontend/package*.json ./
# To match your structure:
COPY package*.json ./
```

### **Update docker-compose.yml**
Change image name to match your Docker Hub:
```yaml
# Change this:
image: ${{ env.DOCKER_REGISTRY }}/${{ env.IMAGE_NAME }}:latest
# To:
image: your-dockerhub-username/deshibites-app:latest
```

### **Update GitHub Actions**
In `.github/workflows/deploy.yml`, verify:
```yaml
env:
  DOCKER_REGISTRY: ${{ secrets.DOCKER_REGISTRY }}
  IMAGE_NAME: deshibites-app  # Keep this name
```

---

## 📋 **Deployment Steps**

### **Option A: Automated (GitHub Actions)**
```bash
# 1. Configure everything above
# 2. Push code
git add .
git commit -m "Initial Docker setup"
git push origin main
# 3. GitHub automatically deploys!
```

### **Option B: Manual**
```bash
# 1. Setup EC2
scp -i key.pem scripts/setup-ec2.sh ec2-user@EC2-IP:~
ssh -i key.pem ec2-user@EC2-IP
./setup-ec2.sh

# 2. Build and deploy
docker build -t your-username/deshibites-app .
docker push your-username/deshibites-app
./scripts/deploy.sh
```

---

## 🌐 **Access Your App**
- **Local testing**: `http://localhost:3000`
- **Production**: `http://your-ec2-ip`
- **With domain**: `http://yourdomain.com`

---

## 🆘 **If Something Goes Wrong**

### **Check Logs**
```bash
# Container logs
docker logs deshibites-app

# GitHub Actions
# Go to your repo → Actions tab → View failed run
```

### **Test Locally First**
```bash
# Test the build process
docker-compose up --build

# Should open at http://localhost:3000
```

### **Common Fixes**
- **"Permission denied"**: Add user to docker group
- **"Port in use"**: Stop conflicting services
- **"Build failed"**: Check package.json location
- **"Deploy failed"**: Verify GitHub secrets

---

## 📞 **Support Resources**
- Docker logs: `docker logs container-name`
- GitHub Actions logs: Repo → Actions tab
- AWS EC2 console: Check instance status
- This documentation: All steps explained

**✅ Once working, bookmark your production URL and enjoy your deployed app!**
