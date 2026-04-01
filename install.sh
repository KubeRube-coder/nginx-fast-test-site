#!/bin/bash

set -e

echo "Installing nginx..."
apt update
apt install -y nginx

echo "Creating nginx config..."
cat > /etc/nginx/sites-available/loadtest <<EOL
server {
    listen 80;
    server_name _;

    root /var/www/loadtest;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }

    location ~* \.(js|css|jpg|png)$ {
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate";
    }

    gzip off;
}
EOL

ln -sf /etc/nginx/sites-available/loadtest /etc/nginx/sites-enabled/loadtest

echo "Removing default config..."
rm -f /etc/nginx/sites-enabled/default

echo "Copying site..."
mkdir -p /var/www/loadtest
curl -sSL https://raw.githubusercontent.com/KubeRube-coder/nginx-fast-test-site/refs/heads/main/site/index.html -o /var/www/loadtest/index.html
curl -sSL https://raw.githubusercontent.com/KubeRube-coder/nginx-fast-test-site/refs/heads/main/site/large.js -o /var/www/loadtest/large.js
curl -sSL https://raw.githubusercontent.com/KubeRube-coder/nginx-fast-test-site/refs/heads/main/site/large.css -o /var/www/loadtest/large.css

echo "Copying site assets..."
mkdir -p /var/www/loadtest/assets
curl -sSL https://raw.githubusercontent.com/KubeRube-coder/nginx-fast-test-site/refs/heads/main/site/assets/img1.jpg -o /var/www/loadtest/assets/img1.jpg
curl -sSL https://raw.githubusercontent.com/KubeRube-coder/nginx-fast-test-site/refs/heads/main/site/assets/img2.jpg -o /var/www/loadtest/assets/img2.jpg

echo "Restarting nginx..."
systemctl restart nginx

SERVER_IP=$(curl -s https://api.ipify.org)

echo "Done! Open http://$SERVER_IP"