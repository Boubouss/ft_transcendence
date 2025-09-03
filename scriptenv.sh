#!/bin/bash

DOMAIN="$(hostname -f)"

# ----- .env front -----
FRONT_ENV_PATH="sources/front/.env"

cat > "$FRONT_ENV_PATH" <<EOF
VITE_API_USER="https://$DOMAIN:3443/api/user"
VITE_API_GAME="https://$DOMAIN:3443/api/game"
VITE_API_LOGIC="https://$DOMAIN:3443/api/logic"

VITE_USER_WSS="wss://$DOMAIN:3443/wss/user/friends"
VITE_LOBBY_WSS="wss://$DOMAIN:3443/wss/game/lobby"
VITE_LOGIC_WSS="wss://$DOMAIN:3443/wss/logic/ws"
EOF

echo ".env front généré avec succès ✅ ($FRONT_ENV_PATH, domaine détecté : $DOMAIN)"

# ----- .env global -----
GLOBAL_ENV_PATH=".env"

cat >> "$GLOBAL_ENV_PATH" <<EOF

HTTPS_KEY="./ssl/localhost.key"
HTTPS_CERT="./ssl/localhost.crt"

JWT_KEY="efzi;567sdgs5dsg67eon&!vm2!35naev&12!?423"

MAILER_ADDR="transcendence42pong@gmail.com"
MAILER_PSWD="wfqi kxwh xoak mkan"

GOOGLE_OAUTH_URI="https://$DOMAIN:3443/api/user/auth/google/callback"

FRONT_URL="https://$DOMAIN:3443"
FRONT_DOMAIN="$DOMAIN"

API_USER="https://user:3000"
API_LOGIC="https://logic:3002"
API_GAME="https://game:3001"

NGROK_TOKEN="31vCGAdO0psr1fEgX88zcZ8uUkW_5GRVbASvZDeftXGMvmiJV"
EOF

