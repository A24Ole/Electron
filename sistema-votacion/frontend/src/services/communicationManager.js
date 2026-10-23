import WebSocketService from "./WebSocketService";

// Mismos valores que el backend: empieza en 40000 y, si no conecta, prueba el siguiente puerto
const PUERTO_INICIAL = Number(import.meta.env.VITE_WS_PORT) || 40000;
const MAX_INTENTOS = 20;

let ws = null;

function urlsCandidatas() {
  // Si se define una URL fija, se usa solo esa
  if (import.meta.env.VITE_WS_URL) return [import.meta.env.VITE_WS_URL];

  // En Electron (file://) no hay hostname, así que se usa localhost
  const host = window.location.hostname || "localhost";
  const protocolo = window.location.protocol === "https:" ? "wss" : "ws";
  return Array.from(
    { length: MAX_INTENTOS + 1 },
    (_, i) => `${protocolo}://${host}:${PUERTO_INICIAL + i}`,
  );
}

export function conectar() {
  if (!ws) {
    ws = new WebSocketService(urlsCandidatas());
    ws.connect();
  }
}

export function votar(opcion) {
  ws?.send(opcion);
}

export function reiniciarVotos() {
  ws?.send("reset");
}

export function desconectar() {
  ws?.disconnect();
  ws = null;
}
