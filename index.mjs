import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const httpServer = app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});

const wss = new WebSocketServer({ server: httpServer });

app.get("/", (req, res) => {
  res.send("WebSocket chat server is running.");
});

// Store connected clients
const clients = new Set();

wss.on("connection", (socket) => {
  console.log("A new client connected");
  clients.add(socket);

  // Notify all clients about the new connection
  broadcastMessage("A new user has joined the chat!", socket);

  // Handle incoming messages
  socket.on("message", (data) => {
    const message = data.toString();
    console.log("Received message:", message);

    // Broadcast the message to all connected clients
    broadcastMessage(message, socket);
  });

  // Handle client disconnection
  socket.on("close", () => {
    console.log("A client disconnected");
    clients.delete(socket);
    broadcastMessage("A user has left the chat.", socket);
  });

  // Handle errors
  socket.on("error", console.error);
});

// Broadcast a message to all connected clients
function broadcastMessage(message, sender) {
  clients.forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
