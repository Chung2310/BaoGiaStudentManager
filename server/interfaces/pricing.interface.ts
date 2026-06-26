import { Document } from "mongoose";

export interface IPricing extends Document {
  studentRange: string;
  basic6Month: number;
  basic12Month: number;
  plusFirstYear: number;
  plusNextYears: number;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}
