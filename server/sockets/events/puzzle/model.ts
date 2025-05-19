import mongoose, { type Model, Schema } from "mongoose";

import { type IPuzzle } from "./interface";

const puzzleSchema = new Schema<IPuzzle>(
  {
    title: { type: String, required: true },
    difficult: { type: String, required: true },
    cols: { type: Number, required: true },
    questions: {
      type: [
        {
          label: String,
          answer: String,
        },
      ],
      required: true,
    },
    matrix: { type: [[String]], required: true },
    isPublic: { type: Boolean, default: true },
    owner: { type: Schema.Types.ObjectId, ref: "users", required: true },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "categories",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.puzzles as Model<IPuzzle>) ||
  mongoose.model<IPuzzle>("puzzles", puzzleSchema);
