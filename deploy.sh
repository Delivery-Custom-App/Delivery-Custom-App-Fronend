#!/bin/bash

# Deploy manual de emergencia para Delivery-Custom-App-INGSW2-FRONTEND.
# El deploy normal es automático vía .github/workflows/deploy.yml (push a
# main). Usar este script solo si el CI está caído — corre localmente
# (no en el server, no hay docker compose ni git ahí; el server solo
# recibe el build vía rsync).

set -e

SERVER="root@100.89.15.17"
REMOTE_DIR="/var/www/delivery-frontend"

echo "🚀 Build local..."
npm ci
npm run build

echo "📦 Backup remoto..."
STAMP=$(date +%Y%m%d_%H%M%S)
ssh "$SERVER" "mkdir -p /var/www/backups/$STAMP && tar -C /var/www -czf /var/www/backups/$STAMP/delivery-frontend.tgz delivery-frontend"

echo "📤 Sincronizando dist/ al server..."
rsync -az --delete dist/ "$SERVER:$REMOTE_DIR/"

echo "✅ Deploy completo!"
curl -sf -o /dev/null -w "site:%{http_code}\n" "https://gestflow.mardev.cl"
