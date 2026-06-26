import { Document, Types } from "mongoose";

export interface IPricing extends Document {
  projectId: Types.ObjectId;
  studentRange: string;
  prices: Map<string, number>;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}
