import { Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  description?: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}
