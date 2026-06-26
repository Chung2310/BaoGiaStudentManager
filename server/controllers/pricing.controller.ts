import { Request, Response, NextFunction } from "express";
import { PricingService } from "../services/pricing.service";

export class PricingController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PricingService.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 100;
      const search = req.query.search as string;
      const projectId = req.query.projectId as string;

      const result = await PricingService.getList({ page, limit, search, projectId });
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await PricingService.getDetail(id as string);
      if (!data) {
        return res.status(404).json({ success: false, error: "Không tìm thấy cấu hình giá." });
      }
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await PricingService.update(id as string, req.body);
      if (!data) {
        return res.status(404).json({ success: false, error: "Không tìm thấy cấu hình giá để cập nhật." });
      }
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await PricingService.delete(id as string);
      if (!data) {
        return res.status(404).json({ success: false, error: "Không tìm thấy cấu hình giá để xóa." });
      }
      res.json({ success: true, message: "Xóa cấu hình giá thành công." });
    } catch (error) {
      next(error);
    }
  }
}
