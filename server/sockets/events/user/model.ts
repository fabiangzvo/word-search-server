import { model, Schema } from 'mongoose'

import { type IUser } from './interface'

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

export default model<IUser>('users', userSchema)
