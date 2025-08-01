# 🔧 Troubleshooting Guide - DeshiBites Docker Deployment

## 🚨 **Most Common Issues & Solutions**

### **1. Build Errors**

#### **Error: "package.json not found"**
```bash
Error: COPY failed: file not found in build context
```
**Solution:**
```dockerfile
# In Dockerfile, check path matches your structure
# If package.json is in root, change:
COPY frontend/package*.json ./
# To:
COPY package*.json ./
```

#### **Error: "npm run build failed"**
```bash
npm ERR! missing script: build
```
**Solution:**
Add build script to your `frontend/package.json`:
```json
{
  "scripts": {
    "build": "react-scripts build",
    "start": "react-scripts start"
  }
}
```

### **2. GitHub Actions Failures**

#### **Error: "Permission denied (publickey)"**
```bash
Host key verification failed
```
**Solution:**
1. Check EC2_SSH_KEY secret format:
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
-----END RSA PRIVATE KEY-----
```
2. Verify EC2 security group allows SSH (port 22)

#### **Error: "Docker login failed"**
```bash
Error response from daemon: login attempt failed
```
**Solution:**
Check GitHub secrets:
- `DOCKER_USERNAME` = your Docker Hub username (not email)
- `DOCKER_PASSWORD` = your Docker Hub password

### **3. Deployment Issues**

#### **Error: "Port 80 already in use"**
```bash
bind: address already in use
```
**Solution:**
```bash
# Find what's using port 80
sudo lsof -i :80
# Kill the process
sudo kill -9 PID_NUMBER
# Or use different port
docker run -p 8080:80 your-app
```

#### **Error: "docker: permission denied"**
```bash
permission denied while trying to connect to Docker daemon
```
**Solution:**
```bash
# Add user to docker group
sudo usermod -a -G docker $USER
# Log out and back in, or:
newgrp docker
```

### **4. Container Runtime Issues**

#### **Error: "Container exits immediately"**
```bash
Container "deshibites-app" exited with code 1
```
**Solution:**
```bash
# Check container logs
docker logs deshibites-app

# Common fixes:
# 1. nginx config error - check nginx.conf syntax
# 2. Missing files - verify build completed
# 3. Wrong permissions - check file ownership
```

#### **Error: "Health check failing"**
```bash
Health check failed
```
**Solution:**
```bash
# Test health check manually
docker exec deshibites-app wget --spider http://localhost/

# If fails, check:
# 1. nginx is running: docker exec container ps aux
# 2. Files exist: docker exec container ls /usr/share/nginx/html
# 3. Port accessible: docker exec container netstat -tlnp
```

### **5. Network & Connectivity**

#### **Error: "502 Bad Gateway"**
```bash
nginx: [error] connect() failed
```
**Solution:**
Check nginx.conf API proxy settings:
```nginx
# If you don't have backend, remove or comment:
location /api/ {
    proxy_pass http://backend:3001/;
    # ... proxy settings
}
```

#### **Error: "Connection refused"**
```bash
curl: (7) Failed to connect to port 80: Connection refused
```
**Solution:**
1. Check container is running: `docker ps`
2. Check port mapping: `docker port container-name`
3. Check EC2 security groups allow port 80
4. Check firewall: `sudo firewall-cmd --list-ports`

### **6. Database Issues**

#### **Error: "Connection to database failed"**
```bash
Access denied for user 'deshibites_user'@'%'
```
**Solution:**
Check environment variables match:
```env
# In .env file
DB_USER=deshibites_user
DB_PASSWORD=your-password

# In docker-compose.yml
MYSQL_USER: ${DB_USER}
MYSQL_PASSWORD: ${DB_PASSWORD}
```

#### **Error: "Database not found"**
```bash
Unknown database 'deshibites_db'
```
**Solution:**
```bash
# Check database was created
docker exec -it mysql-container mysql -u root -p
SHOW DATABASES;

# If missing, recreate:
CREATE DATABASE deshibites_db;
```

---

## 🛠️ **Diagnostic Commands**

### **Check System Status**
```bash
# Container status
docker ps -a

# System resources
df -h  # Disk space
free -h  # Memory
docker system df  # Docker disk usage
```

### **Debug Containers**
```bash
# Get shell access
docker exec -it container-name /bin/sh

# Check nginx config
docker exec container-name nginx -t

# View real-time logs
docker logs -f container-name

# Check processes inside container
docker exec container-name ps aux
```

### **Network Debugging**
```bash
# Test connectivity
curl -I http://localhost
wget --spider http://localhost

# Check port bindings
docker port container-name
netstat -tlnp | grep 80

# DNS resolution
nslookup your-domain.com
```

---

## 🔍 **Log Analysis**

### **Important Log Locations**
```bash
# Application logs
docker logs deshibites-app

# Nginx access logs
docker exec container-name cat /var/log/nginx/access.log

# Nginx error logs  
docker exec container-name cat /var/log/nginx/error.log

# System logs (on EC2)
sudo journalctl -u docker
```

### **Log Patterns to Look For**
```bash
# Successful requests
"GET / HTTP/1.1" 200

# Permission errors
"Permission denied"

# Resource issues
"Cannot allocate memory"
"No space left on device"

# Network issues
"Connection refused"
"Timeout"
```

---

## 🚀 **Performance Issues**

### **Slow Loading**
```bash
# Check resource usage
docker stats

# Optimize nginx config
# Enable gzip (already in nginx.conf)
# Add caching headers (already included)

# Check network
ping your-ec2-ip
```

### **High Memory Usage**
```bash
# Check container limits
docker inspect container-name | grep -i memory

# Set memory limits
docker run -m 512m your-image

# Or in docker-compose.yml:
services:
  frontend:
    mem_limit: 512m
```

---

## 📋 **Prevention Checklist**

### **Before Deployment**
- [ ] Test build locally: `docker build -t test .`
- [ ] Test run locally: `docker run -p 8080:80 test`
- [ ] Verify all environment variables
- [ ] Check GitHub secrets are correct
- [ ] Ensure EC2 has enough disk space
- [ ] Verify security groups

### **After Deployment**
- [ ] Check application loads: `curl http://your-ip`
- [ ] Verify database connection
- [ ] Test all major features
- [ ] Check logs for errors
- [ ] Monitor resource usage
- [ ] Setup health monitoring

---

## 🆘 **Emergency Recovery**

### **Quick Rollback**
```bash
# Stop current container
docker stop deshibites-app

# Run previous version
docker run -d --name deshibites-app-backup \
  -p 80:80 your-username/deshibites-app:previous-tag

# Or rollback GitHub deployment
git revert HEAD
git push origin main
```

### **Complete Reset**
```bash
# Stop everything
docker-compose down

# Remove all containers and images
docker system prune -a

# Start fresh
docker-compose up --build
```

---

## 📞 **Getting Help**

### **What to Include When Asking for Help**
1. **Error message** (exact text)
2. **Command you ran**
3. **Container logs**: `docker logs container-name`
4. **System info**: `docker version && docker-compose version`
5. **Environment**: AWS EC2, local, etc.

### **Useful Commands for Support**
```bash
# Gather debug info
docker version
docker-compose version
docker images
docker ps -a
docker logs deshibites-app
free -h
df -h
```

Remember: Most issues are configuration-related. Double-check your environment variables, file paths, and GitHub secrets first! 🔍
