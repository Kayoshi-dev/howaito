import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

console.log("Starting server...");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.join(socket.handshake.query["uuid"]);
});

httpServer.listen(8000);
