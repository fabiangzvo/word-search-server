import { RandomNumbers } from "@lib/randomNumbers";

import { IGameClient, IGamePuzzle } from "./interface";
import GameModel from "./model";

export class GameService {
  private randomNumbers: RandomNumbers = RandomNumbers.getInstance();

  constructor() {}

  public async addPlayer(gameId: string, user: string): Promise<IGameClient> {
    const data = await GameModel.findById(gameId, { users: true }).exec();

    const color = this.randomNumbers.getRandomNumber(
      data?.users.map(({ color }) => color) || []
    );

    if (
      data?.users.some(({ user: userActive }) => userActive.toString() === user)
    )
      throw new Error("User already joined");

    const game = await GameModel.findByIdAndUpdate(
      gameId,
      {
        $addToSet: {
          users: {
            user,
            color,
          },
        },
      },
      { new: true }
    ).populate("users.user", "-password");

    if (!game) throw new Error("Game not found");

    return game.toJSON<IGameClient>({ flattenObjectIds: true });
  }

  public async removePlayer(
    gameId: string,
    userId: string
  ): Promise<IGameClient> {
    const data = await GameModel.findById(gameId, { startedAt: true }).exec();

    if (data?.finishedAt) throw new Error("The game has already ended");

    if (data?.startedAt) throw new Error("The game has already started");

    const game = await GameModel.findByIdAndUpdate(gameId, {
      $pull: { users: { user: userId } },
    }).populate("users.user", "-password");

    if (!game) throw new Error("Game not found");

    return game.toJSON<IGameClient>({ flattenObjectIds: true });
  }

  public async addResponse(data: {
    gameId: string;
    user: string;
    question: string;
    coords: Array<[Number, Number]>;
  }): Promise<IGamePuzzle> {
    const { gameId, ...body } = data;
    const game = await GameModel.findOneAndUpdate(
      { _id: gameId },
      { $addToSet: { responses: body } },
      { new: true }
    )
      .populate("users.user", "-password")
      .populate("puzzle");

    if (!game) throw new Error("Game not found");

    return game.toJSON<IGamePuzzle>({ flattenObjectIds: true });
  }

  public async startGame(gameId: string): Promise<IGameClient> {
    const game = await GameModel.findByIdAndUpdate(
      gameId,
      { startedAt: new Date() },
      { new: true }
    );

    if (!game) throw new Error("Game not found");

    return game.toJSON<IGameClient>({ flattenObjectIds: true });
  }

  public async finishGame(gameId: string): Promise<IGameClient> {
    const game = await GameModel.findByIdAndUpdate(
      gameId,
      { finishedAt: new Date() },
      { new: true }
    );

    if (!game) throw new Error("Game not found");

    return game.toJSON<IGameClient>({ flattenObjectIds: true });
  }
}
