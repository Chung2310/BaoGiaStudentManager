import { Pricing } from "../models/pricing.model";
import { IPricing } from "../interfaces/pricing.interface";
import { logger } from "../config/logger";

interface GetListQuery {
  page: number;
  limit: number;
  search?: string;
}

export class PricingService {
  static async create(data: Partial<IPricing>): Promise<IPricing> {
    const pricing = new Pricing(data);
    return await pricing.save();
  }

  static async getList(query: GetListQuery) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;
    
    const filter: Record<string, any> = {};
    if (search) {
      filter.studentRange = { $regex: search, $options: "i" };
    }

    const list = await Pricing.find(filter)
      .sort({ order: 1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Pricing.countDocuments(filter);
    
    return {
      list,
      total,
      page,
      limit,
    };
  }

  static async getDetail(id: string): Promise<IPricing | null> {
    return await Pricing.findById(id);
  }

  static async update(id: string, data: Partial<IPricing>): Promise<IPricing | null> {
    return await Pricing.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  static async delete(id: string): Promise<IPricing | null> {
    return await Pricing.findByIdAndDelete(id);
  }

  static async seedDefaultData() {
    try {
      const count = await Pricing.countDocuments();
      if (count === 0) {
        logger.info(">>> Seeding default pricing data from PDF...");
        const defaultPricing = [
          {
            studentRange: "0 - 100",
            prices: { basic6Month: 3, basic12Month: 5, plusFirstYear: 8, plusNextYears: 6 },
            order: 1,
          },
          {
            studentRange: "101 - 300",
            prices: { basic6Month: 5, basic12Month: 8, plusFirstYear: 12, plusNextYears: 10 },
            order: 2,
          },
          {
            studentRange: "301 - 500",
            prices: { basic6Month: 7, basic12Month: 12, plusFirstYear: 18, plusNextYears: 14 },
            order: 3,
          },
          {
            studentRange: "501 - 700",
            prices: { basic6Month: 12, basic12Month: 18, plusFirstYear: 27, plusNextYears: 22 },
            order: 4,
          },
          {
            studentRange: "701 – 1.000",
            prices: { basic6Month: 17, basic12Month: 27, plusFirstYear: 39, plusNextYears: 32 },
            order: 5,
          },
          {
            studentRange: "1.001 – 2.000",
            prices: { basic6Month: 22, basic12Month: 32, plusFirstYear: 48, plusNextYears: 39 },
            order: 6,
          },
          {
            studentRange: "2.001 – 3.000",
            prices: { basic6Month: 32, basic12Month: 45, plusFirstYear: 68, plusNextYears: 61 },
            order: 7,
          },
          {
            studentRange: "3.001 – 4.000",
            prices: { basic6Month: 40, basic12Month: 55, plusFirstYear: 84, plusNextYears: 78 },
            order: 8,
          },
          {
            studentRange: "4001-5000",
            prices: { basic6Month: 46, basic12Month: 63, plusFirstYear: 97, plusNextYears: 91 },
            order: 9,
          },
        ];
        await Pricing.insertMany(defaultPricing);
        logger.info(">>> Seeded default pricing data successfully.");
      }
    } catch (error) {
      logger.error(">>> Error seeding pricing data:", error);
    }
  }
}
