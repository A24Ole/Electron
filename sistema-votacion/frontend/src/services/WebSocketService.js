import { useAppStore } from "@/stores/app";

class WebSocketService {
  // urls: lista de URLs a probar en orden (p. ej. ws://host:40000, ws://host:40001, ...)
  constructor(urls) {
    this.urls = Array.isArray(urls) ? urls : [urls];
    this.indice = 0;
    this.socket = null;
    this.cerradoManualmente = false;
    this.store = useAppStore();
  }

  connect() {
    const url = this.urls[this.indice];
    let abierto = false;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      abierto = true;
      console.log(`WebSocket connection established (${url})`);
    };

    // El servidor envía siempre el array completo de votos
    this.socket.onmessage = (event) => {
      this.store.setVotos(JSON.parse(event.data));
    };

    this.socket.onclose = () => {
      if (this.cerradoManualmente) return;

      // No se llegó a conectar: se prueba inmediatamente con el siguiente puerto
      if (!abierto && this.indice < this.urls.length - 1) {
        console.warn(
          `No se pudo conectar a ${url}, probando el siguiente puerto...`,
        );
        this.indice++;
        this.connect();
        return;
      }

      // Se perdió la conexión o no respondió ningún puerto: se reintenta en 5 s.
      // Si había conectado se mantiene el mismo puerto; si no, se vuelve a empezar.
      if (!abierto) this.indice = 0;
      console.log("WebSocket connection closed");
      setTimeout(() => this.connect(), 5000);
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  // Mensajes: el índice de la opción votada, o "reset" para poner los votos a 0
  send(mensaje) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(mensaje);
    } else {
      console.error("WebSocket is not connected.");
    }
  }

  disconnect() {
    this.cerradoManualmente = true;
    if (this.socket) {
      this.socket.close();
    }
  }
}

export default WebSocketService;
