#!/bin/bash

# Simple EC2 connection script for Windows users
# This will help you connect to EC2 and run the setup

echo "🚀 Connecting to EC2 instance..."
echo "📍 IP: 63.176.99.200"
echo ""

# Instructions for Windows users
echo "📋 Windows SSH Connection Steps:"
echo "1. Open Command Prompt or PowerShell as Administrator"
echo "2. Navigate to your Downloads folder: cd C:\\Users\\%USERNAME%\\Downloads"
echo "3. Run this command:"
echo ""
echo "ssh -i deshibites-app.pem -o StrictHostKeyChecking=no ec2-user@63.176.99.200"
echo ""
echo "4. Once connected to EC2, run these commands:"
echo ""
echo "# Make script executable"
echo "chmod +x ec2-setup-complete.sh"
echo ""
echo "# Run the setup script"
echo "./ec2-setup-complete.sh"
echo ""
echo "# Logout and login again for Docker group"
echo "exit"
echo "ssh -i deshibites-app.pem ec2-user@63.176.99.200"
echo ""
echo "# Test Docker installation"
echo "docker run hello-world"
echo ""
echo "🎯 After setup is complete, your EC2 will be ready for GitHub Actions deployment!"
