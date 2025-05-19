import { Document, Types } from "mongoose";

export interface Question {
  label: string;
  answer: string;
  _id: string;
}

export type Difficult = "easy" | "medium" | "hard";

export interface IPuzzle extends Document {
  title: string;
  difficult: Difficult;
  cols: number;
  questions: Question[];
  matrix: string[][];
  isPublic: boolean;
  owner: Types.ObjectId;
  categories: Types.ObjectId[];
}
