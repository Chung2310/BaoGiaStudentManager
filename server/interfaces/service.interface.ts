import { Document, Types } from "mongoose";

export interface IService extends Document {
  projectId: Types.ObjectId;
  serviceName: string;
  contents: Map<string, string[]>;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}
