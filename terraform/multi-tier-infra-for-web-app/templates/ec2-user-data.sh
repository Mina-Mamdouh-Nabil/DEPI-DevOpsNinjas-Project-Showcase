#!/bin/bash
# Update system packages
sudo dnf update -y

# Install Apache (httpd)
sudo dnf install -y httpd

# Enable and start Apache service
sudo systemctl enable httpd
sudo systemctl start httpd

# Create a simple index page with workspace info
echo "This is server in workspace " | sudo tee /var/www/html/index.html
