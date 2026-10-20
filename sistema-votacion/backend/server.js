import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';
import fs from 'fs';

const app = express();
app.use(cors());

const server = createServer(app);
const wss = new WebSocketServer({ server });

// 👈 1. Variable para almacenar los votos en memoria
let votos = {};

// 👈 2. Leemos el estado inicial de los votos desde el archivo JSON al iniciar
try {
  const data = fs.readFileSync('votos.json', 'utf8');
  votos = JSON.parse(data);
  console.log('Estado inicial de votos cargado desde votos.json');
} catch (err) {
  // Si el archivo no existe o hay un error, empezamos con un objeto vacío
  console.error('No se pudo leer votos.json, se iniciará con un objeto vacío.', err.message);
}

// Función para difundir (broadcast) un mensaje a todos los clientes conectados
function broadcast(data) {
  const message = JSON.stringify(data);
  console.log("Enviando actualización a todos los clientes:", message);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
}

// Evento que se dispara cuando un cliente se conecta
wss.on('connection', (ws) => {
  console.log('Cliente conectado al WebSocket');

  // 👈 3. Enviamos el estado actual de los votos al nuevo cliente
  // Ahora la variable 'votos' ya tiene los datos cargados.
  ws.send(JSON.stringify(votos));

  // Evento que se dispara cuando se recibe un mensaje de un cliente
  ws.on('message', (message) => {
    const votedOption = message.toString();
    console.log("Llega una votación para:", votedOption);

    // Actualizamos el recuento de votos si la opción existe
    if (votos.hasOwnProperty(votedOption)) {
      votos[votedOption]++;
    } else {
      console.warn(`La opción "${votedOption}" no existe en votos.json`);
      return;
    }

    // Guardamos el JSON actualizado
    fs.writeFile('votos.json', JSON.stringify(votos, null, 2), (err) => {
      if (err) {
        console.error("Error al escribir en el archivo:", err);
        return;
      }
      // Emitimos el JSON actualizado a TODOS los clientes
      broadcast(votos);
    });
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(3999, () => {
  console.log('Servidor corriendo en http://localhost:3999');
});