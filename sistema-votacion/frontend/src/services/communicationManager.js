import WebSocketService from "./WebSocketService";

let ws = null;

export function conectar() {
  if (!ws) {
    ws = new WebSocketService("ws://localhost:3999");
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
