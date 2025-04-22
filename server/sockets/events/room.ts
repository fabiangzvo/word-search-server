import { Server, Socket } from "socket.io";
import { Logger as WinstonLogger } from "winston";

import { Logger } from "../../lib/logger";

export class Room {
  private logger: WinstonLogger = Logger.getInstance();

  constructor(socket: Socket, _: Server) {
    socket.on("join-room", (data:string) => {
      const { roomId, user } = JSON.parse(data);

      socket.join(roomId);
      socket.to(roomId).emit("user-joined", user);

      this.logger.info(`User ${user} joined room ${roomId}`, { section: "room" }); 
    });
  }
}
