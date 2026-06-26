import { Request, Response, NextFunction } from "express";
import { PackageService } from "../services/package.service";

export class PackageController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PackageService.create(req.body);
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

      const result = await PackageService.getList({ page, limit, search });
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PackageService.getAll();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await PackageService.getDetail(id as string);
      if (!data) {
        return res.status(404).json({ success: false, error: "Không tìm thấy gói cước." });
      }
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await PackageService.update(id as string, req.body);
      if (!data) {
        return res.status(404).json({ success: false, error: "Không tìm thấy gói cước để cập nhật." });
      }
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await PackageService.delete(id as string);
      if (!data) {
        return res.status(404).json({ success: false, error: "Không tìm thấy gói cước để xóa." });
      }
      res.json({ success: true, message: "Xóa gói cước thành công." });
    } catch (error) {
      next(error);
    }
  }
}
