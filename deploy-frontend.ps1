# Simple DeshiBites Deployment (Frontend Only)
# PowerShell script for Windows users

Write-Host "🍽️ DeshiBites Frontend Deployment" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (!(Test-Path "frontend\package.json")) {
    Write-Host "❌ Error: frontend\package.json not found" -ForegroundColor Red
    Write-Host "Please run this script from the DeshiBites project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Deploying React Frontend Application" -ForegroundColor Blue
Write-Host ""

Write-Host "📋 Required GitHub Secrets (make sure these are configured):" -ForegroundColor Blue
Write-Host "• DOCKER_USERNAME - Your Docker Hub username"
Write-Host "• DOCKER_PASSWORD - Your Docker Hub password"
Write-Host "• DOCKER_REGISTRY - Your Docker Hub username"
Write-Host "• EC2_HOST - Your EC2 public IP address"
Write-Host "• EC2_USERNAME - ec2-user"
Write-Host "• EC2_SSH_KEY - Your private SSH key content"
Write-Host ""

$response = Read-Host "Have you configured all GitHub secrets? (y/N)"
if ($response -ne "y" -and $response -ne "Y") {
    Write-Host "Please configure GitHub secrets first, then run this script again." -ForegroundColor Yellow
    Write-Host "Go to: https://github.com/TechDeitySpark/deshibites-restaurant/settings/secrets/actions" -ForegroundColor Blue
    exit 1
}

Write-Host "🔄 Preparing deployment..." -ForegroundColor Yellow

# Add all changes
Write-Host "📦 Adding changes to Git..." -ForegroundColor Blue
git add .

# Check if there are changes to commit
$gitStatus = git status --porcelain
if ([string]::IsNullOrEmpty($gitStatus)) {
    Write-Host "ℹ️ No changes to commit, deploying existing code..." -ForegroundColor Yellow
} else {
    # Commit changes
    Write-Host "💾 Committing changes..." -ForegroundColor Blue
    $commitMsg = "Deploy frontend-only DeshiBites - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git commit -m $commitMsg
}

# Push to GitHub
Write-Host "⬆️ Pushing to GitHub (this will trigger deployment)..." -ForegroundColor Blue
git push origin main

Write-Host ""
Write-Host "✅ Deployment initiated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Monitor your deployment:" -ForegroundColor Yellow
Write-Host "1. GitHub Actions: https://github.com/TechDeitySpark/deshibites-restaurant/actions"
Write-Host "2. Watch the 'Deploy to EC2' workflow"
Write-Host ""
Write-Host "⏱️ Deployment Process:" -ForegroundColor Blue
Write-Host "1. 🧪 Run tests (2-3 minutes)"
Write-Host "2. 🐳 Build Docker image (3-5 minutes)"
Write-Host "3. 📤 Push to Docker Hub (1-2 minutes)"
Write-Host "4. 🚀 Deploy to EC2 (2-3 minutes)"
Write-Host ""
Write-Host "🌐 Your app will be available at:" -ForegroundColor Green
Write-Host "• http://YOUR-EC2-IP (port 80)"
Write-Host "• http://YOUR-EC2-IP:3000 (port 3000)"
Write-Host ""
Write-Host "📱 After deployment:" -ForegroundColor Yellow
Write-Host "• Test your restaurant interface"
Write-Host "• Check admin dashboard functionality"
Write-Host "• Verify menu display and cart features"
Write-Host ""
Write-Host "🔧 Troubleshooting:" -ForegroundColor Blue
Write-Host "• If deployment fails, check GitHub Actions logs"
Write-Host "• SSH to EC2: ssh -i your-key.pem ec2-user@YOUR-EC2-IP"
Write-Host "• Check containers: docker ps"
Write-Host "• View logs: docker logs <container-name>"
Write-Host ""
Write-Host "🎉 Happy deploying!" -ForegroundColor Green
