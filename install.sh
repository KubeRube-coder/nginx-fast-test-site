#!/bin/bash

set -e

echo "Installing nginx..."
apt update
apt install -y nginx

echo "Copying config..."
cp nginx.conf /etc/nginx/sites-available/loadtest
ln -sf /etc/nginx/sites-available/loadtest /etc/nginx/sites-enabled/loadtest

echo "Removing default config..."
rm -f /etc/nginx/sites-enabled/default

echo "Copying site..."
mkdir -p /var/www/loadtest
cp -r site/* /var/www/loadtest/

echo "Restarting nginx..."
systemctl restart nginx

SERVER_IP=$(curl -s https://api.ipify.org)

echo "Done! Open http://$SERVER_IP"