import { Setting } from "../models/setting.model";
import { ISetting } from "../interfaces/setting.interface";
import { logger } from "../config/logger";

interface GetListQuery {
  page: number;
  limit: number;
  search?: string;
}

export class SettingService {
  static async create(data: Partial<ISetting>): Promise<ISetting> {
    const setting = new Setting(data);
    return await setting.save();
  }

  static async getList(query: GetListQuery) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (search) {
      filter.$or = [
        { key: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const list = await Setting.find(filter)
      .sort({ key: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Setting.countDocuments(filter);

    return {
      list,
      total,
      page,
      limit,
    };
  }

  static async getDetail(id: string): Promise<ISetting | null> {
    return await Setting.findById(id);
  }

  static async getByKey(key: string): Promise<ISetting | null> {
    return await Setting.findOne({ key });
  }

  static async update(id: string, data: Partial<ISetting>): Promise<ISetting | null> {
    return await Setting.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  static async delete(id: string): Promise<ISetting | null> {
    return await Setting.findByIdAndDelete(id);
  }

  static async upsertByKey(key: string, value: string, description?: string): Promise<ISetting> {
    const existing = await Setting.findOne({ key });
    if (existing) {
      return (await Setting.findByIdAndUpdate(existing._id, { $set: { value } }, { new: true }))!;
    }
    return await Setting.create({ key, value, description });
  }

  static async seedDefaultData() {
    try {
      const count = await Setting.countDocuments();
      if (count === 0) {
        logger.info(">>> Seeding default settings data...");
        const defaultSettings = [
          { key: "phone", value: "0968 688 888", description: "Số điện thoại liên hệ" },
          { key: "company_name", value: "CÔNG TY CỔ PHẦN CÔNG NGHỆ IGEN", description: "Tên công ty" },
          { key: "address", value: "Lô LK3 LK4 Đường Lạc Long Quân, Phường Kinh Bắc, Thành phố Bắc Ninh, Tỉnh Bắc Ninh, Việt Nam", description: "Địa chỉ công ty" },
          { key: "tax_code", value: "2301355232 (Cấp bởi Sở KH&ĐT Tỉnh Bắc Ninh)", description: "Mã số thuế / GPKD" },
          { key: "apply_date", value: "01/08/2025", description: "Ngày áp dụng bảng giá" },
          { key: "email", value: "", description: "Email liên hệ" },
          { key: "website", value: "", description: "Website công ty" },
        ];
        await Setting.insertMany(defaultSettings);
        logger.info(">>> Seeded default settings successfully.");
      } else {
        // Ensure new keys exist for existing deployments
        const newKeys = [
          { key: "company_name", value: "CÔNG TY CỔ PHẦN CÔNG NGHỆ IGEN", description: "Tên công ty" },
          { key: "address", value: "Lô LK3 LK4 Đường Lạc Long Quân, Phường Kinh Bắc, Thành phố Bắc Ninh, Tỉnh Bắc Ninh, Việt Nam", description: "Địa chỉ công ty" },
          { key: "tax_code", value: "2301355232 (Cấp bởi Sở KH&ĐT Tỉnh Bắc Ninh)", description: "Mã số thuế / GPKD" },
          { key: "apply_date", value: "01/08/2025", description: "Ngày áp dụng bảng giá" },
          { key: "email", value: "", description: "Email liên hệ" },
          { key: "website", value: "", description: "Website công ty" },
        ];
        for (const s of newKeys) {
          const exists = await Setting.findOne({ key: s.key });
          if (!exists) await Setting.create(s);
        }
      }
    } catch (error) {
      logger.error(">>> Error seeding settings data:", error);
    }
  }
}
