import { Feature } from "../models/feature.model";
import { IFeature } from "../interfaces/feature.interface";
import { logger } from "../config/logger";

interface GetListQuery {
  page: number;
  limit: number;
  search?: string;
  projectId?: string;
}

export class FeatureService {
  static async create(data: Partial<IFeature>): Promise<IFeature> {
    const feature = new Feature(data);
    return await feature.save();
  }

  static async getList(query: GetListQuery) {
    const { page, limit, search, projectId } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (projectId) filter.projectId = projectId;
    if (search) {
      filter.category = { $regex: search, $options: "i" };
    }

    const list = await Feature.find(filter).sort({ order: 1 }).skip(skip).limit(limit);
    const total = await Feature.countDocuments(filter);

    return { list, total, page, limit };
  }

  static async getDetail(id: string): Promise<IFeature | null> {
    return await Feature.findById(id);
  }

  static async update(id: string, data: Partial<IFeature>): Promise<IFeature | null> {
    return await Feature.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  static async delete(id: string): Promise<IFeature | null> {
    return await Feature.findByIdAndDelete(id);
  }

  static async seedDefaultData(defaultProjectId: any) {
    try {
      const count = await Feature.countDocuments({ projectId: defaultProjectId });
      if (count === 0) {
        logger.info(">>> Seeding default feature data from PDF...");
        const defaultFeatures = [
          {
            category: "Đào tạo",
            contents: {
              Basic: ["Quản lý chương trình học, lớp học, khoá học, thời khoá biểu...", "App giáo viên, phụ huynh"],
              Plus: ["Full tính năng", "App giáo viên, phụ huynh"],
            },
            order: 1,
          },
          {
            category: "Tài chính",
            contents: {
              Basic: ["Quản lý khoản thu", "Quản lý kho vật phẩm"],
              Plus: ["Quản lý khoản thu", "Quản lý kho vật phẩm"],
            },
            order: 2,
          },
          {
            category: "CRM",
            contents: {
              Basic: ["Quản lý khách hàng tiềm năng", "Quản lý lịch hẹn khách hàng", "Quản lý lịch sử chăm sóc"],
              Plus: ["Quản lý khách hàng tiềm năng", "Quản lý lịch hẹn khách hàng", "Quản lý lịch sử chăm sóc"],
            },
            order: 3,
          },
          {
            category: "Báo cáo",
            contents: {
              Basic: ["Báo cáo đào tạo", "Báo cáo tài chính", "Báo cáo CRM", "Không phát triển báo cáo"],
              Plus: ["Báo cáo đào tạo", "Báo cáo tài chính", "Báo cáo CRM", "Mở rộng một số báo cáo theo yêu cầu"],
            },
            order: 4,
          },
          {
            category: "Tích hợp",
            contents: {
              Basic: ["Không tích hợp"],
              Plus: ["Tích hợp", "Call Center", "Thanh toán trực tuyến", "Học trực tuyến", "Elearn", "*Không bao gồm phí dịch vụ trả cho bên thứ ba"],
            },
            order: 5,
          },
          {
            category: "Tính năng mới",
            contents: {
              Basic: [
                "Tối ưu tất cả các tính năng hiện có của hệ thống.",
                "Tính phí theo lộ trình phát triển tính năng của sản phẩm.",
                "Không tùy chỉnh hệ thống theo yêu cầu riêng của từng doanh nghiệp/đơn vị.",
              ],
              Plus: [
                "Miễn phí cập nhật các tính năng mới theo lộ trình phát triển sản phẩm (không bao gồm chi phí dịch vụ bên thứ ba).",
                "Tùy chỉnh hệ thống theo nhu cầu và mong muốn riêng của doanh nghiệp/đơn vị nếu khả thi (có tính phí).",
              ],
            },
            order: 6,
          },
        ].map((item) => ({ ...item, projectId: defaultProjectId }));
        await Feature.insertMany(defaultFeatures);
        logger.info(">>> Seeded default feature data successfully.");
      }
    } catch (error) {
      logger.error(">>> Error seeding feature data:", error);
    }
  }
}
