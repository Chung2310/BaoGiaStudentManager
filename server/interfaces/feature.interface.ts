import { Document } from "mongoose";

export interface IFeature extends Document {
  category: string;
  basicContent: string[];
  plusContent: string[];
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}
