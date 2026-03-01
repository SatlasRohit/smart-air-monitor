import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",   // allow all origins
      methods: ["GET", "POST"]
    }
  });
};

export { io };