import { Service } from "../models/service.model";
import { IService } from "../interfaces/service.interface";
import { logger } from "../config/logger";

interface GetListQuery {
  page: number;
  limit: number;
  search?: string;
}

export class ServiceService {
  static async create(data: Partial<IService>): Promise<IService> {
    const service = new Service(data);
    return await service.save();
  }

  static async getList(query: GetListQuery) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (search) {
      filter.serviceName = { $regex: search, $options: "i" };
    }

    const list = await Service.find(filter)
      .sort({ order: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Service.countDocuments(filter);

    return {
      list,
      total,
      page,
      limit,
    };
  }

  static async getDetail(id: string): Promise<IService | null> {
    return await Service.findById(id);
  }

  static async update(id: string, data: Partial<IService>): Promise<IService | null> {
    return await Service.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  static async delete(id: string): Promise<IService | null> {
    return await Service.findByIdAndDelete(id);
  }

  static async seedDefaultData() {
    try {
      const count = await Service.countDocuments();
      if (count === 0) {
        logger.info(">>> Seeding default customer service data from PDF...");
        const defaultServices = [
          {
            serviceName: "Số lần đào tạo tại doanh nghiệp/đơn vị",
            basicContent: [
              "Hỗ trợ đào tạo trực tiếp 01 lần/năm (doanh nghiệp/đơn vị ngoài khu vực Hà Nội và Hồ Chí Minh hỗ trợ trực tuyến)",
              "Đào tạo trực tuyến tối đa 02 lần/năm",
              "Giải đáp thắc mắc không giới hạn"
            ],
            plusContent: [
              "Hỗ trợ đào tạo trực tiếp 02 lần (doanh nghiệp/đơn vị ngoài khu vực Hà Nội và Hồ Chí Minh hỗ trợ trực tuyến)",
              "Hỗ trợ trực tiếp thêm 01 lần với quy mô doanh nghiệp từ >500 người dùng/học viên",
              "Đào tạo trực tuyến không giới hạn, phát sinh khi có nhu cầu",
              "Hỗ trợ đào tạo khi có nhân viên mới"
            ],
            order: 1
          },
          {
            serviceName: "Nội dung hỗ trợ",
            basicContent: [
              "Hỗ trợ đưa dữ liệu/thao tác (Khóa học, lớp học, Học viên, Chương trình học, Hóa đơn, Hợp đồng) lần đầu sử dụng."
            ],
            plusContent: [
              "Hỗ trợ đưa dữ liệu/ thao tác (Khóa học, lớp học, Học viên, Chương trình học, Hóa đơn, Hợp đồng) trong 03 tháng đầu sử dụng"
            ],
            order: 2
          },
          {
            serviceName: "Thời gian hỗ trợ",
            basicContent: [
              "Phản hồi trong khoảng 9h00 - 18h00 từ thứ 2 đến thứ 6",
              "Thứ 7 và Chủ nhật phản hồi khi có phát sinh",
              "Không hỗ trợ đào tạo vào thứ 7/chủ nhật"
            ],
            plusContent: [
              "Phản hồi trong khoảng 8h30 - 21h00 từ thứ 2 đến thứ 6",
              "Thứ 7 và Chủ nhật phản hồi khi có phát sinh",
              "Nhận lịch đào tạo thứ 7/Chủ nhật nếu có kế hoạch trước"
            ],
            order: 3
          },
          {
            serviceName: "Số nhân sự hỗ trợ",
            basicContent: [
              "01 nhân sự"
            ],
            plusContent: [
              "02 nhân sự"
            ],
            order: 4
          }
        ];
        await Service.insertMany(defaultServices);
        logger.info(">>> Seeded default customer service data successfully.");
      }
    } catch (error) {
      logger.error(">>> Error seeding customer service data:", error);
    }
  }
}
