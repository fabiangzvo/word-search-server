import { Socket } from "socket.io";
import { Logger as WinstonLogger } from "winston";

import { Logger } from "@lib/logger";

import { GameService } from "./service";

export class GameController {
  private logger: WinstonLogger = Logger.getInstance();
  private gameService: GameService;
  private socket: Socket;

  constructor(socket: Socket) {
    this.logger.info("Initializing GameController", { section: this.constructor.name });

    this.socket = socket;
    this.gameService = new GameService()

    socket.on("add-player", this.addPlayer.bind(this));

    this.logger.info("GameController initialized", { section: this.constructor.name });
  }

  public async addPlayer(data: string): Promise<void> {
    try {
      this.logger.info(`Adding player starting`, { section: "gameController" });
      const { gameId, user } = JSON.parse(data);

      const game = await this.gameService.addPlayer(gameId, user);
      if (!game) {
        this.logger.info(`User ${user} was not joined to game: ${gameId}`, { section: "room" });

        return
      }

      this.socket.join(gameId);
      this.socket.to(gameId).emit("user-joined", user);

      this.logger.info(`User ${user} joined room ${gameId}`, { section: "room" });
    } catch (e) {
      this.logger.error(`Error adding player with data: ${data}, error: ${e}`, { section: "gameController" });
    }
  }
}
