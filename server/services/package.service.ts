import { Package } from "../models/package.model";
import { IPackage } from "../interfaces/package.interface";
import { logger } from "../config/logger";

interface GetListQuery {
  page: number;
  limit: number;
  search?: string;
}

export class PackageService {
  static async create(data: Partial<IPackage>): Promise<IPackage> {
    const pkg = new Package(data);
    return await pkg.save();
  }

  static async getList(query: GetListQuery) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { group: { $regex: search, $options: "i" } },
      ];
    }

    const list = await Package.find(filter)
      .sort({ order: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Package.countDocuments(filter);

    return {
      list,
      total,
      page,
      limit,
    };
  }

  static async getAll() {
    return await Package.find().sort({ order: 1 });
  }

  static async getDetail(id: string): Promise<IPackage | null> {
    return await Package.findById(id);
  }

  static async update(id: string, data: Partial<IPackage>): Promise<IPackage | null> {
    return await Package.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  static async delete(id: string): Promise<IPackage | null> {
    const pkg = await Package.findById(id);
    if (pkg) {
      await Package.findByIdAndDelete(id);
      // Dynamic cleanup: remove this package key from all pricing plans in DB
      const { Pricing } = await import("../models/pricing.model");
      await Pricing.updateMany({}, { $unset: { [`prices.${pkg.key}`]: "" } });
    }
    return pkg;
  }

  static async seedDefaultData() {
    try {
      const count = await Package.countDocuments();
      if (count === 0) {
        logger.info(">>> Seeding default package columns from PDF...");
        const defaultPackages = [
          { key: "basic6Month", name: "Gói 06 Tháng", group: "Basic", order: 1 },
          { key: "basic12Month", name: "Gói 12 Tháng", group: "Basic", order: 2 },
          { key: "plusFirstYear", name: "Phí hệ thống năm đầu tiên", group: "Plus", order: 3 },
          { key: "plusNextYears", name: "Phí hệ thống các năm tiếp theo", group: "Plus", order: 4 },
        ];
        await Package.insertMany(defaultPackages);
        logger.info(">>> Seeded default package columns successfully.");
      }
    } catch (error) {
      logger.error(">>> Error seeding package data:", error);
    }
  }
}
