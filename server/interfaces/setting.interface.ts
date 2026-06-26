import { Document } from "mongoose";

export interface ISetting extends Document {
  key: string;
  value: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
