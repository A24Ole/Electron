import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import fs from "fs";

// El servidor solo atiende WebSocket; una petición HTTP normal sirve para comprobar que está vivo
const server = createServer((req, res) => {
  res.end("Servidor de votación funcionando");
});
const wss = new WebSocketServer({ server });

let votos = {};

try {
  const data = fs.readFileSync("votos.json", "utf8");
  votos = JSON.parse(data);
  console.log("Estado inicial de votos cargado desde votos.json");
} catch (err) {
  console.error(
    "No se pudo leer votos.json, se iniciará con un objeto vacío.",
    err.message,
  );
}

function broadcast(data) {
  const message = JSON.stringify(data);
  console.log("Enviando actualización a todos los clientes:", message);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
}

wss.on("connection", (ws) => {
  console.log("Cliente conectado al WebSocket");

  ws.send(JSON.stringify(votos));

  ws.on("message", (message) => {
    const votedOption = message.toString();
    console.log("Llega un mensaje:", votedOption);

    // "reset" pone todos los contadores a 0 (lo envía el botón del admin)
    if (votedOption === "reset") {
      votos = votos.map(() => 0);
    } else if (votos.hasOwnProperty(votedOption)) {
      votos[votedOption]++;
    } else {
      console.warn(`La opción "${votedOption}" no existe en votos.json`);
      return;
    }

    fs.writeFile("votos.json", JSON.stringify(votos, null, 2), (err) => {
      if (err) {
        console.error("Error al escribir en el archivo:", err);
        return;
      }
      // Emitimos el JSON actualizado a TODOS los clientes
      broadcast(votos);
    });
  });

  ws.on("close", () => {
    console.log("Cliente desconectado");
  });
});

const PUERTO_INICIAL = Number(process.env.PORT) || 40000;
const MAX_INTENTOS = 20;

wss.on("error", () => {});

function alFallarArranque(err) {
  const puerto = this.puertoActual;
  if (err.code === "EADDRINUSE" && puerto - PUERTO_INICIAL < MAX_INTENTOS) {
    console.warn(
      `El puerto ${puerto} está ocupado, probando con el ${puerto + 1}...`,
    );
    escuchar(puerto + 1);
  } else {
    console.error("No se pudo iniciar el servidor:", err.message);
    process.exit(1);
  }
}

function escuchar(puerto) {
  server.puertoActual = puerto;
  server.listen(puerto);
}

server.on("error", alFallarArranque);
server.once("listening", () => {
  server.off("error", alFallarArranque);
  console.log(
    `Servidor corriendo en http://localhost:${server.address().port}`,
  );
});

escuchar(PUERTO_INICIAL);
