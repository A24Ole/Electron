
import { useAppStore } from '@/stores/app';

class WebSocketService {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.store = useAppStore();
  }

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Assuming the server sends the array of votes directly
      console.log("votos inicializados")
      this.store.setVotos(data);
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
      // Optional: attempt to reconnect
      setTimeout(() => this.connect(), 5000);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  sendVote(optionIndex) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      // The message format will depend on the backend implementation
      this.socket.send(optionIndex);
    } else {
      console.error('WebSocket is not connected.');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export default WebSocketService;
