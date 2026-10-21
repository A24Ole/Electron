import WebSocketService from "./WebSocketService";

let ws = null;

export function conectar() {
  if (!ws) {
    ws = new WebSocketService(import.meta.env.VITE_WS_URL ?? "ws://localhost:3000");
    ws.connect();
  }
}

export function votar(opcion) {
  ws?.sendVote(opcion);
}

export function desconectar() {
  ws?.disconnect();
  ws = null;
}
