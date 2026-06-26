import { Document } from "mongoose";

export interface IPricing extends Document {
  studentRange: string;
  prices: Map<string, number>;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}
