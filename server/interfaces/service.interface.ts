import { Document } from "mongoose";

export interface IService extends Document {
  serviceName: string;
  basicContent: string[];
  plusContent: string[];
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}
