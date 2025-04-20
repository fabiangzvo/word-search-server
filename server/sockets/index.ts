import { Server as httpServer } from "node:http";
import { Server, Socket } from "socket.io";

export class WebSocketServer {
  private io: Server;

  constructor(server: httpServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.ORIGINS,
      },
    });

    this.attachListeners();
  }

  private attachListeners(): void {
    this.io.on("connection", (socket: Socket) => {
      socket.on("ping", (e) => {
        console.log(e);

        this.io.emit("ping", "socket is working");
      });
    });
  }
}
