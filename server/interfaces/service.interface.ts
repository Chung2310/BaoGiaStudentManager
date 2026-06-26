import { Document } from "mongoose";

export interface IService extends Document {
  serviceName: string;
  contents: Map<string, string[]>;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}
