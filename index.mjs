import express from "express";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const httpServer = app.listen(8080);

const wss = new WebSocketServer({ server: httpServer });

app.get("/", (req, res) => {
  res.send("Hello");
});
wss.on("connection", function connection(socket) {
  socket.on("error", console.error);

  socket.on("message", function message(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data.toString());
      }
    });
  });

  socket.send("Hello");
});
