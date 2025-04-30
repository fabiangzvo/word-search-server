import { Socket, Server } from "socket.io";
import { Logger as WinstonLogger } from "winston";

import { Logger } from "@lib/logger";

import { GameService } from "./service";

export class GameController {
  private logger: WinstonLogger = Logger.getInstance();
  private gameService: GameService;
  private socket: Socket;
  private server: Server;
  private meta = { section: this.constructor.name };

  constructor(socket: Socket, server: Server) {
    this.logger.info("Initializing GameController", this.meta);

    this.socket = socket;
    this.server = server;
    this.gameService = new GameService();

    socket.on("add-player", this.addPlayer.bind(this));
    socket.on("disconnect-player", this.removePlayer.bind(this));

    this.logger.info("GameController initialized", this.meta);
  }

  public async removePlayer(data: string): Promise<void> {
    try {
      this.logger.info(`Removing player starting`, this.meta);
      const { gameId, user } = JSON.parse(data) as {
        gameId: string;
        user: string;
      };

      const game = await this.gameService.removePlayer(gameId, user);
      if (!game) {
        this.logger.info(
          `User ${user} was not removed from game: ${gameId}`,
          this.meta
        );

        return;
      }

      this.socket.leave(gameId);
      this.server.in(gameId).emit(
        "user-left",
        game.users.find((u) => u._id === user)
      );

      this.logger.info(`User ${user} left room ${gameId}`, this.meta);
    } catch (e) {
      this.logger.error(
        `Error removing player with data: ${data}, error: ${e}`,
        this.meta
      );
    }
  }

  public async addPlayer(data: string): Promise<void> {
    try {
      this.logger.info(`Adding player starting`, this.meta);
      const { gameId, user } = JSON.parse(data) as {
        gameId: string;
        user: string;
      };

      const game = await this.gameService.addPlayer(gameId, user);
      if (!game) {
        this.logger.info(
          `User ${user} was not joined to game: ${gameId}`,
          this.meta
        );

        return;
      }

      this.socket.join(gameId);
      this.server.in(gameId).emit(
        "user-joined",
        game.users.find((u) => u._id === user)
      );

      this.logger.info(`User ${user} joined room ${gameId}`, this.meta);
    } catch (e) {
      this.logger.error(
        `Error adding player with data: ${data}, error: ${e}`,
        this.meta
      );
    }
  }
}
