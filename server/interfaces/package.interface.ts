import { Document, Types } from "mongoose";

export interface IPackage extends Document {
  projectId: Types.ObjectId;
  key: string;
  name: string;
  group: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}
