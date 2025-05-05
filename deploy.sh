#!/bin/bash

# Paatthya Educator Backend - EC2 Deployment Script
# Make sure to set execution permission: chmod +x deploy.sh

echo "Starting deployment of Paatthya Educator Backend..."

# Update system packages
echo "Updating system packages..."
sudo yum update -y

# Install or update Node.js
echo "Setting up Node.js..."
curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 globally if not installed
echo "Setting up PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install pm2 -g
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Set up environment variables
echo "Setting up environment variables..."
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please create a .env file with your production values"
    exit 1
fi

# Restart the application using PM2
echo "Starting application with PM2..."
pm2 restart paatthya-backend || pm2 start index.js --name paatthya-backend

# Configure PM2 to start on system boot
echo "Setting up PM2 startup script..."
pm2 startup
pm2 save

echo "Deployment completed successfully!"
echo "Your backend is now running with PM2"
echo "To check status, run: pm2 status" 