import { Schema, model } from "mongoose";
import { IPackage } from "../interfaces/package.interface";

const packageSchema = new Schema<IPackage>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      index: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    group: {
      type: String,
      required: true,
      trim: true,
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

export const Package = model<IPackage>("Package", packageSchema);
