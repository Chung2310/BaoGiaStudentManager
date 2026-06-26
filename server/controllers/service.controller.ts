import { Request, Response, NextFunction } from "express";
import { ServiceService } from "../services/service.service";

export class ServiceController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ServiceService.create(req.body);
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

      const result = await ServiceService.getList({ page, limit, search });
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await ServiceService.getDetail(id as string);
      if (!data) {
        return res.status(404).json({ success: false, error: "Không tìm thấy dịch vụ." });
      }
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await ServiceService.update(id as string, req.body);
      if (!data) {
        return res.status(404).json({ success: false, error: "Không tìm thấy dịch vụ để cập nhật." });
      }
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await ServiceService.delete(id as string);
      if (!data) {
        return res.status(404).json({ success: false, error: "Không tìm thấy dịch vụ để xóa." });
      }
      res.json({ success: true, message: "Xóa dịch vụ thành công." });
    } catch (error) {
      next(error);
    }
  }
}
