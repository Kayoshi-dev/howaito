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
  socket.broadcast.to(socket.handshake.query["uuid"]).emit("newUserConnection");

  socket.on("moveTo", (arg) => {
    socket.broadcast.to(socket.handshake.query["uuid"]).emit("setMoveTo", arg);
  });

  socket.on("isDrawing", (arg) => {
    console.log(arg);
    socket.broadcast
      .to(socket.handshake.query["uuid"])
      .emit("userIsDrawing", arg);
  });
});

httpServer.listen(8000);
