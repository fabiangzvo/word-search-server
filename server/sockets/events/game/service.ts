import { IGameClient } from "./interface";
import GameModel from "./model";

export class GameService {
  constructor() { }

  public async addPlayer(gameId: string, userId: string): Promise<IGameClient> {
    const game = await GameModel.findByIdAndUpdate(
      gameId,
      { $addToSet: { users: userId } },
      { new: true }
    ).populate('users', '-password');

    if (!game) {
      throw new Error("Game not found");
    }

    return game.toJSON<IGameClient>({ flattenObjectIds: true });
  }

}