import { Schema, model } from "mongoose";
import { ISetting } from "../interfaces/setting.interface";

const settingSchema = new Schema<ISetting>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    value: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Setting = model<ISetting>("Setting", settingSchema);
