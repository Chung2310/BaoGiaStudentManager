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
    basic6Month: {
      type: Number,
      required: true,
    },
    basic12Month: {
      type: Number,
      required: true,
    },
    plusFirstYear: {
      type: Number,
      required: true,
    },
    plusNextYears: {
      type: Number,
      required: true,
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
