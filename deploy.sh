#!/usr/bin/env bash
# Despliega el sistema de votación en el servidor del centro:
# compila el frontend, sube frontend y backend, y reinicia el servidor Node.
#
# Uso (desde Git Bash, en la raíz del repositorio):  ./deploy.sh
# Cualquier valor de la configuración se puede sobrescribir con una variable de
# entorno del mismo nombre (así lo usa el workflow de GitHub Actions).
set -euo pipefail

# --- Configuración -----------------------------------------------------------
SERVIDOR="${SERVIDOR:-a24oleproyat@a24oleproyat.dam.inspedralbes.cat}"
WEB="web/a24oleproyat.dam.inspedralbes.cat"                       # relativo al home del servidor
DIR_FRONTEND="${DIR_FRONTEND:-$WEB/public_html/voting-app}"       # carpeta pública de la web
DIR_BACKEND="${DIR_BACKEND:-$WEB/private/voting-app-backend}"     # carpeta privada del backend
PUERTO="${PUERTO:-47652}"
WS_URL="${WS_URL:-ws://a24oleproyat.dam.inspedralbes.cat:$PUERTO}"
SSH="${SSH:-ssh}"   # comandos de conexión (en GitHub Actions se usan con sshpass)
SCP="${SCP:-scp}"
# -----------------------------------------------------------------------------

APP="$(cd "$(dirname "$0")" && pwd)/sistema-votacion"
TEMPORAL="$(mktemp -d)"
trap 'rm -rf "$TEMPORAL"' EXIT

echo "1/4 Compilando el frontend..."
echo "VITE_WS_URL=$WS_URL" > "$APP/frontend/.env.production"
(cd "$APP/frontend" && npm run build)

echo "2/4 Empaquetando..."
mkdir -p "$TEMPORAL/paquete/frontend" "$TEMPORAL/paquete/backend"
cp -r "$APP/frontend/dist/." "$TEMPORAL/paquete/frontend/"
cp "$APP/backend/"{server.js,package.json,package-lock.json,votos.json} "$TEMPORAL/paquete/backend/"
tar -czf "$TEMPORAL/deploy.tar.gz" -C "$TEMPORAL/paquete" frontend backend

echo "3/4 Subiendo al servidor..."
$SCP "$TEMPORAL/deploy.tar.gz" "$SERVIDOR:deploy.tar.gz"

echo "4/4 Instalando y reiniciando el backend..."
$SSH "$SERVIDOR" bash -s -- "$DIR_FRONTEND" "$DIR_BACKEND" "$PUERTO" <<'REMOTO'
set -euo pipefail
FRONTEND="$1"; BACKEND="$2"; PUERTO="$3"

DESCOMPRIMIDO="$(mktemp -d)"
tar -xzf ~/deploy.tar.gz -C "$DESCOMPRIMIDO"
rm ~/deploy.tar.gz
mkdir -p "$FRONTEND" "$BACKEND"

# Frontend: se borran los assets antiguos (cambian de nombre en cada build)
rm -rf "$FRONTEND/assets"
cp -r "$DESCOMPRIMIDO/frontend/." "$FRONTEND/"

# Backend: los votos de producción no se sobrescriben si ya existen
cp "$DESCOMPRIMIDO/backend/"{server.js,package.json,package-lock.json} "$BACKEND/"
[ -f "$BACKEND/votos.json" ] || cp "$DESCOMPRIMIDO/backend/votos.json" "$BACKEND/"
rm -rf "$DESCOMPRIMIDO"

cd "$BACKEND"
npm install --omit=dev --no-audit --no-fund
pkill -u "$USER" -f "node server.js" || true
PORT="$PUERTO" nohup node server.js > server.log 2>&1 < /dev/null &
sleep 2
tail -n 3 server.log
REMOTO

echo "Despliegue completado: http://a24oleproyat.dam.inspedralbes.cat/voting-app"
