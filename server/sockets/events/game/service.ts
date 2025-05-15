import { IGameClient } from "./interface";
import GameModel from "./model";

export class GameService {
  constructor() {}

  public async addPlayer(gameId: string, userId: string): Promise<IGameClient> {
    const game = await GameModel.findByIdAndUpdate(
      gameId,
      { $addToSet: { users: userId } },
      { new: true }
    ).populate("users", "-password");

    if (!game) throw new Error("Game not found");

    return game.toJSON<IGameClient>({ flattenObjectIds: true });
  }

  public async removePlayer(
    gameId: string,
    userId: string
  ): Promise<IGameClient> {
    const game = await GameModel.findByIdAndUpdate(gameId, {
      $pull: { users: userId },
    }).populate("users", "-password");

    if (!game) throw new Error("Game not found");

    return game.toJSON<IGameClient>({ flattenObjectIds: true });
  }

  public async addResponse(data: {
    gameId: string;
    user: string;
    question: string;
    coords: Array<[Number, Number]>;
  }): Promise<IGameClient> {
    const { gameId, ...body } = data;
    const game = await GameModel.findOneAndUpdate(
      { _id: gameId },
      { $addToSet: { responses: body } },
      { new: true }
    ).populate("users", "-password");

    if (!game) throw new Error("Game not found");

    return game.toJSON<IGameClient>({ flattenObjectIds: true });
  }
}
