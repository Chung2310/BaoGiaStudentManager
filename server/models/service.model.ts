import { Schema, model } from "mongoose";
import { IService } from "../interfaces/service.interface";

const serviceSchema = new Schema<IService>(
  {
    serviceName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    contents: {
      type: Map,
      of: [String],
      default: {},
    },
    order: {
      type: Number,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Service = model<IService>("Service", serviceSchema);
