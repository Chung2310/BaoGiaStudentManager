import { Document } from "mongoose";

export interface IFeature extends Document {
  category: string;
  contents: Map<string, string[]>;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}
