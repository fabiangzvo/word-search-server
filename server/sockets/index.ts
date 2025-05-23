import { Server as httpServer } from "node:http";
import { Server, Socket } from "socket.io";
import { Logger as WinstonLogger } from "winston";

import { Logger } from "@lib/logger";

import { GameController } from "./events/game/controller";

export class WebSocketServer {
  private io: Server;
  private logger: WinstonLogger = Logger.getInstance();

  constructor(server: httpServer) {
    this.logger.info("Initializing WebSocket config", { section: "socket" });

    this.io = new Server(server, {
      cors: {
        origin: process.env.ORIGINS,
      },
    });

    this.io.on("connection", (socket: Socket) => {
      new GameController(socket, this.io);

      this.attachAdditionalListeners(socket)
    });

    this.logger.info("WebSocket config initialized", { section: "socket" });
  }

  private attachAdditionalListeners(socket: Socket): void {
    socket.on("disconnect", (socketId) => {
      this.logger.info(`user ${socketId} disconnected`, { section: this.constructor.name })
    });

    socket.on("ping", () => {
      this.io.emit("ping", "socket is working");
    });
  }
}
