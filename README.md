# Sistema de votación en tiempo real

Aplicación web de votación en la que todos los usuarios conectados ven los resultados actualizarse **al instante**. Cada voto se envía al servidor por **WebSocket**, se guarda en disco y se reenvía a todos los clientes, que actualizan los contadores y la gráfica sin recargar la página.

**Live demo:** [http://a24oleproyat.dam.inspedralbes.cat/voting-app](http://a24oleproyat.dam.inspedralbes.cat/voting-app)

> **Nota:** La demo está alojada en un servidor educativo del centro, por lo que su disponibilidad podría verse interrumpida o quedar inoperativa con el tiempo.

### Usuarios de prueba

| Usuario | Contraseña |
| ------- | ---------- |
| `user`  | `123`      |
| `admin` | `123`      |

---

## Características

- **Votación en tiempo real** con WebSocket: abre la app en dos navegadores y vota en uno para ver el cambio en el otro.
- **Gráfica de barras** de los resultados con Chart.js.
- **Persistencia**: los votos se guardan en `backend/votos.json` y se conservan al reiniciar el servidor.
- **Internacionalización**: español, català e English. El idioma se detecta del navegador, se puede cambiar desde el selector de la cabecera y se recuerda entre visitas.
- **Login** con rutas protegidas: sin sesión iniciada no se puede acceder a la votación.
- **Reinicio de votos para el admin**: el usuario `admin` tiene un botón para poner todos los contadores a 0 (pide confirmación).
- **Reconexión automática**: si se pierde la conexión con el servidor, el cliente vuelve a conectarse solo.
- **Versión de escritorio** con Electron.

## Tecnologías

| Parte    | Tecnologías                                                 |
| -------- | ----------------------------------------------------------- |
| Frontend | Vue 3, Vite, Pinia, Vue Router, vue-i18n, Chart.js          |
| Backend  | Node.js, ws (WebSocket)                                     |
| Otros    | Electron (escritorio), Docker Compose (desarrollo), nodemon |

## Estructura del proyecto

```
sistema-votacion/
├── backend/
│   ├── server.js          # Servidor HTTP + WebSocket
│   └── votos.json         # Recuento de votos (uno por opción)
├── frontend/
│   └── src/
│       ├── components/    # Login, botones de voto y de reset, gráfica, selector de idioma
│       ├── i18n/          # Configuración de idiomas y traducciones (es, ca, en)
│       ├── router/        # Rutas y protección de la ruta de votación
│       ├── services/      # Conexión WebSocket con el backend
│       ├── stores/        # Estado global (Pinia): sesión y votos
│       └── views/         # Pantallas de login y de votación
├── electron/              # Aplicación de escritorio
└── docker-compose.yml
```

## Cómo funciona

1. Al arrancar, el **backend** lee `votos.json`, por ejemplo `[12, 9, 12, 9]`: un contador por opción.
2. Cuando un cliente se conecta por WebSocket, el servidor le envía el recuento actual.
3. Al pulsar un botón, el cliente envía el **índice de la opción** (`"0"`, `"1"`, …).
4. El servidor suma el voto, guarda `votos.json` y envía el nuevo recuento a **todos** los clientes conectados.
5. Cada cliente actualiza el estado en Pinia, y los botones y la gráfica se redibujan.

Si el puerto del backend está ocupado, el servidor prueba automáticamente el siguiente (40000, 40001, …). El frontend, si no tiene una URL configurada, hace lo mismo hasta encontrarlo.

## Ejecución en local

Requisitos: **Node.js 22** o superior.

### 1. Backend

```bash
cd sistema-votacion/backend
npm install
npm start
```

El servidor arranca en `http://localhost:40000`. Si abres esa dirección en el navegador verás `Servidor de votación funcionando`: así puedes comprobar que está en marcha (la app se comunica con él por WebSocket).

### 2. Frontend

```bash
cd sistema-votacion/frontend
npm install
npm run dev
```

Abre la URL que muestra Vite (normalmente `http://localhost:5173`) e inicia sesión con uno de los usuarios de prueba.

### Variables de entorno

| Variable       | Dónde    | Descripción                                                  | Por defecto |
| -------------- | -------- | ------------------------------------------------------------ | ----------- |
| `PORT`         | backend  | Puerto inicial del servidor                                  | `40000`     |
| `VITE_WS_URL`  | frontend | URL fija del WebSocket (p. ej. `ws://midominio:47652`)       | —           |
| `VITE_WS_PORT` | frontend | Puerto inicial que prueba el cliente si no hay `VITE_WS_URL` | `40000`     |

Tienes un ejemplo en `frontend/.env.example`.

## Despliegue en producción

El script `deploy.sh` hace todo el proceso de una vez desde Git Bash: compila el frontend, sube frontend y backend por SSH y reinicia el servidor. Los votos que ya hay en producción no se sobrescriben.

```bash
./deploy.sh
```

La configuración (servidor, carpetas y puerto) está al principio del script. Paso a paso, el despliegue es este:

1. **Backend**: se sube la carpeta `backend` al servidor y se arranca en segundo plano en el puerto asignado:

   ```bash
   npm install --omit=dev
   PORT=47652 nohup node server.js > server.log 2>&1 &
   ```

2. **Frontend**: se crea `frontend/.env.production` con la URL pública del backend y se compila:

   ```bash
   echo "VITE_WS_URL=ws://a24oleproyat.dam.inspedralbes.cat:47652" > .env.production
   npm run build
   ```

   El contenido de `frontend/dist/` se sube a la carpeta pública de la web. Las rutas de los archivos son relativas, así que funciona también dentro de una subcarpeta como `/voting-app`.

## Aplicación de escritorio (Electron)

```bash
cd sistema-votacion/frontend
npm run build
cp -r dist ../electron/dist
cd ../electron
npm install
npm start
```

## Docker (desarrollo)

```bash
cd sistema-votacion
docker compose up --build
```

El backend se publica en el puerto `3000` (`PORT=3000`). Para que el frontend lo encuentre, añade `VITE_WS_PORT=3000` al `environment` del servicio `frontend` en `docker-compose.yml`.

## Autor

[@prochkoyatsko](https://github.com/prochkoyatsko) — Proyecto de DAM, Institut Pedralbes.
