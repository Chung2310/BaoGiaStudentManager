import { Document } from "mongoose";

export interface IPackage extends Document {
  key: string;
  name: string;
  group: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}
