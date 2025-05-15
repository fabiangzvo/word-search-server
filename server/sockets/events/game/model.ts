import { model, Schema } from 'mongoose'

import { IGame } from './interface'

const gameSchema = new Schema<IGame>(
  {
    puzzle: { type: Schema.Types.ObjectId, ref: 'puzzles', required: true },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
    ],
    startedAt: { type: Date, required: false },
    finishedAt: { type: Date, required: false },
    responses: {
      type: [
        {
          question:{type: Schema.Types.ObjectId, required: true},
          user: { type: Schema.Types.ObjectId, ref: 'users', required: true },
          coords: Array<[Number, Number]>,
        },
      ],
      required: true,
    },
    winner: { type: Schema.Types.ObjectId, ref: 'users', required: false },
  },
  {
    timestamps: true,
  }
)

export default model<IGame>('games', gameSchema)
