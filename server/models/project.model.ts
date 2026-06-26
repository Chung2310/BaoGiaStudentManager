import { Schema, model } from "mongoose";
import { IProject } from "../interfaces/project.interface";

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    order: { type: Number, required: true, default: 0, index: true },
  },
  { timestamps: true }
);

export const Project = model<IProject>("Project", projectSchema);
