@echo off
echo DeshiBites EC2 Connection Helper
echo ==================================

echo 1. First, copy deshibites-app.pem to this folder
echo 2. Then run this script

if not exist "deshibites-app.pem" (
    echo ERROR: deshibites-app.pem not found in current directory
    echo Please copy it from Downloads folder
    pause
    exit /b 1
)

echo Connecting to EC2...
ssh -i deshibites-app.pem -o StrictHostKeyChecking=no ec2-user@63.176.99.200
