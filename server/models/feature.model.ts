import { Schema, model } from "mongoose";
import { IFeature } from "../interfaces/feature.interface";

const featureSchema = new Schema<IFeature>(
  {
    category: {
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

export const Feature = model<IFeature>("Feature", featureSchema);
