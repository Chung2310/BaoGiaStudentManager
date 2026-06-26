import { Document, Types } from "mongoose";

export interface IFeature extends Document {
  projectId: Types.ObjectId;
  category: string;
  contents: Map<string, string[]>;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}
