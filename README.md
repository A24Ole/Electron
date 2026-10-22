# Sistema de Votación

Aplicación de votaciones simples, en tiempo real: los usuarios inician sesión, votan y ven los resultados actualizados en un gráfico.

## Tecnologías

- **Frontend:** Vue 3 + Vite, Vuetify, Pinia, Vue Router y Chart.js
- **Backend:** Node.js con Express y WebSockets (`ws`)
- **Escritorio:** Electron
- **Entorno de desarrollo:** Docker / Docker Compose

## Ejecutar en local

Requisitos: Node.js 22+ y Docker.

### 1. Backend y frontend (Docker)

```bash
cd sistema-votacion
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend: http://localhost:3000

### 2. App de escritorio (Electron)

Con el backend en marcha, genera el build del frontend y cópialo a la carpeta de Electron:

```bash
cd sistema-votacion/frontend
npm install
npm run build
cp -r dist ../electron/dist
```

```bash
cd sistema-votacion/electron
npm install
npm start
```
