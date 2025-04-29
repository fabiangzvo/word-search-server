import { Document, Types } from 'mongoose'

import { IUserDetail } from '../user/interface'

interface Response {
  user: Types.ObjectId
  question: Types.ObjectId
}

export interface IGame extends Document {
  puzzle: Types.ObjectId
  users: Types.ObjectId[]
  startedAt: Date
  finishedAt: Date
  responses: Response[]
  winner: Types.ObjectId
}

export interface IGameClient {
  _id: string
  puzzle: string
  users: IUserDetail[]
  startedAt: Date
  finishedAt: Date
  responses: { user: string; question: string }[]
  winner: string
}