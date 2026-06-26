import { Schema, model } from "mongoose";
import { IPricing } from "../interfaces/pricing.interface";

const pricingSchema = new Schema<IPricing>(
  {
    studentRange: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    prices: {
      type: Map,
      of: Number,
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

export const Pricing = model<IPricing>("Pricing", pricingSchema);
